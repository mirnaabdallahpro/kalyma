import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    return null;
  }

  return session.user;
}

// Table réelle dans Supabase pour chaque origine de tâche
const TABLE_BY_SOURCE = {
  manual: "tasks",
  strategy: "business_strategy_priorities",
  diagnostic: "business_diagnostic_recommendations",
};


/* =========================================================
   NORMALISATION — chaque table a son propre schéma,
   on ramène tout au même format Task pour le Kanban.
   ========================================================= */

function mapManualTask(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category || "Tâche",
    meta: row.meta || "",
    priorityColor: row.priority_color || "accent",
    status: row.status,
    position: row.position,
    source: "manual",
  };
}

function mapStrategyPriority(row) {
  const colorByPriority = { high: "secondary", medium: "accent", low: "muted" };

  return {
    id: row.id,
    title: row.title,
    category: "Stratégie",
    meta: row.description ? row.description.slice(0, 60) : "",
    priorityColor: colorByPriority[row.priority] || "accent",
    status: row.status,
    position: row.position,
    source: "strategy",
  };
}

function mapDiagnosticRecommendation(row) {
  const colorByImpact = { high: "secondary", medium: "accent", low: "muted" };
  const labelByPriority = {
    priority: "Priorité",
    work_on: "À travailler",
    optional: "Optionnel",
  };

  return {
    id: row.id,
    title: row.title,
    category: "Diagnostic IA",
    meta: labelByPriority[row.priority] || "",
    priorityColor: colorByImpact[row.impact] || "accent",
    status: row.status,
    position: row.position,
    source: "diagnostic",
  };
}

// Ordre d'affichage par défaut entre sources au sein d'une même colonne
const SOURCE_RANK = { manual: 0, strategy: 1, diagnostic: 2 };


/* =========================================================
   LECTURE
   ========================================================= */

export async function getAllTasks() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const [manualRes, strategyRes, diagnosticRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true }),
    supabase
      .from("business_strategy_priorities")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true }),
    supabase
      .from("business_diagnostic_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true }),
  ]);

  if (manualRes.error) throw manualRes.error;
  if (strategyRes.error) throw strategyRes.error;
  if (diagnosticRes.error) throw diagnosticRes.error;

  const tasks = [
    ...manualRes.data.map(mapManualTask),
    ...strategyRes.data.map(mapStrategyPriority),
    ...diagnosticRes.data.map(mapDiagnosticRecommendation),
  ];

  tasks.sort((a, b) => {
    if (a.status !== b.status) return 0; // le tri par colonne se fait au rendu (filter)
    const rankDiff = SOURCE_RANK[a.source] - SOURCE_RANK[b.source];
    if (rankDiff !== 0) return rankDiff;
    return a.position - b.position;
  });

  return tasks;
}


/* =========================================================
   ÉCRITURE — tâches manuelles uniquement
   (les tâches "strategy" / "diagnostic" sont créées ailleurs,
   seul leur statut/position bouge depuis le Kanban)
   ========================================================= */

export async function createTask({ title, category, meta, priorityColor, status }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("tasks")
    .select("position")
    .eq("user_id", user.id)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw fetchError;
  }

  const nextPosition = existing?.length ? existing[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title,
      category: category || "",
      meta: meta || "",
      priority_color: priorityColor || "accent",
      status: status || "todo",
      position: nextPosition,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapManualTask(data);
}

export async function updateTask(id, updates) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const payload = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.meta !== undefined) payload.meta = updates.meta;
  if (updates.priorityColor !== undefined) payload.priority_color = updates.priorityColor;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapManualTask(data);
}

export async function deleteTask(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
}


/* =========================================================
   DÉPLACEMENT KANBAN — fonctionne pour les 3 sources
   (drag & drop : statut + position, quelle que soit l'origine)
   ========================================================= */

// orderedIds = ids, dans l'ordre visuel final, des tâches de CETTE
// source qui se retrouvent dans la colonne cible après le drop.
// movedTaskId / newStatus servent à mettre à jour le statut de la
// tâche déplacée en plus de sa position.
export async function reorderTasks(source, orderedIds, movedTaskId, newStatus) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const table = TABLE_BY_SOURCE[source];

  if (!table) {
    throw new Error(`Source de tâche inconnue : ${source}`);
  }

  const updates = orderedIds.map((id, index) => {
    const payload = { position: index };

    if (id === movedTaskId) {
      payload.status = newStatus;
    }

    return supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id);
  });

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed) {
    throw failed.error;
  }
}



/*
export async function createDiagnosticTasks(recommendations = []) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return [];
  }

  // Récupérer la dernière position utilisée
  const { data: existing, error: fetchError } = await supabase
    .from("business_diagnostic_recommendations")
    .select("position")
    .eq("user_id", user.id)
    .order("position", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw fetchError;
  }

  let nextPosition = existing?.length
    ? existing[0].position + 1
    : 0;

  const rows = recommendations.map((recommendation) => {
    const row = {
      user_id: user.id,
      title:
        recommendation.title ||
        recommendation.recommendation ||
        recommendation.text ||
        "Action recommandée par le diagnostic IA",

      description:
        recommendation.description ||
        recommendation.recommendation ||
        recommendation.finding ||
        "",

      priority:
        recommendation.priority === "high"
          ? "priority"
          : recommendation.priority === "medium"
          ? "work_on"
          : "optional",

      impact:
        recommendation.impact ||
        recommendation.priority ||
        "medium",

      status: "todo",

      position: nextPosition++,
    };

    return row;
  });

  const { data, error } = await supabase
    .from("business_diagnostic_recommendations")
    .insert(rows)
    .select();

  if (error) {
    throw error;
  }

  return data.map(mapDiagnosticRecommendation);
}

*/

export async function createDiagnosticTasks(
  recommendations = [],
  diagnosticId,
  profile
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  if (!diagnosticId) {
    throw new Error(
      "Diagnostic ID manquant."
    );
  }

  if (!profile) {
  throw new Error("Profil business introuvable.");
}

  if (!recommendations.length) {
    return [];
  }

  const titles = recommendations
    .map(
      (recommendation) =>
        recommendation.title ||
        recommendation.recommendation ||
        recommendation.text
    )
    .filter(Boolean);

  // Vérifier les doublons uniquement
  // dans le diagnostic courant
  const {
    data: existing,
    error: existingError,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .select("title")
    .eq("user_id", user.id)
    .eq("diagnostic_id", diagnosticId)
    .in("title", titles);

  if (existingError) {
    throw existingError;
  }

  const existingTitles = new Set(
    (existing || []).map(
      (item) => item.title
    )
  );

  const newRecommendations =
    recommendations.filter(
      (recommendation) => {
        const title =
          recommendation.title ||
          recommendation.recommendation ||
          recommendation.text;

        return (
          title &&
          !existingTitles.has(title)
        );
      }
    );

  if (!newRecommendations.length) {
    return [];
  }

  // Position uniquement pour ce diagnostic
  const {
    data: lastPosition,
    error: positionError,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .select("position")
    .eq("user_id", user.id)
    .eq("diagnostic_id", diagnosticId)
    .order("position", {
      ascending: false,
    })
    .limit(1);

  if (positionError) {
    throw positionError;
  }

  let nextPosition = lastPosition?.length
    ? lastPosition[0].position + 1
    : 0;

  const rows = newRecommendations.map(
    (recommendation) => {
      const priority =
        recommendation.priority ||
        "medium";

      return {
        // 🔗 Liaison avec le diagnostic
        diagnostic_id: diagnosticId,
        business_profile_id: profile.id,

        user_id: user.id,

        title:
          recommendation.title ||
          recommendation.recommendation ||
          recommendation.text,

        description:
          recommendation.description ||
          recommendation.recommendation ||
          "",

        priority:
          priority === "high"
            ? "priority"
            : priority === "medium"
            ? "work_on"
            : "optional",

        impact:
          recommendation.impact ||
          priority,

        status: "todo",

        position: nextPosition++,
      };
    }
  );

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .insert(rows)
    .select();

  if (error) {
    throw error;
  }

  return data.map(
    mapDiagnosticRecommendation
  );
}