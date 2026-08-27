import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user || null;
}

function mapObjective(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    target: row.target,
    current: row.current,
    unit: row.unit,
    deadline: row.deadline,
    status: row.status,
    position: row.position,
    sourceRecommendationId: row.source_recommendation_id,
    projectsCount: row.projects?.[0]?.count ?? undefined,
  };
}

function mapProject(row) {
  return {
    id: row.id,
    objectiveId: row.objective_id,
    title: row.title,
    description: row.description,
    status: row.status,
    position: row.position,
  };
}

function mapResource(row) {
  return {
    id: row.id,
    taskId: row.task_id,
    projectId: row.project_id,
    objectiveId: row.objective_id,
    type: row.type,
    title: row.title,
    url: row.url,
    content: row.content,
  };
}


/* =========================================================
   OBJECTIFS
   ========================================================= */

export async function getObjectives() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("objectives")
    .select("*, projects(count)")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) throw error;
  return data.map(mapObjective);
}

export async function createObjective(form) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data, error } = await supabase
    .from("objectives")
    .insert({
      user_id: user.id,
      title: form.title,
      description: form.description || "",
      target: form.target || null,
      current: form.current || 0,
      unit: form.unit || "",
      deadline: form.deadline || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapObjective(data);
}

export async function updateObjective(id, updates) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.target !== undefined) payload.target = updates.target;
  if (updates.current !== undefined) payload.current = updates.current;
  if (updates.unit !== undefined) payload.unit = updates.unit;
  if (updates.deadline !== undefined) payload.deadline = updates.deadline;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from("objectives")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return mapObjective(data);
}

export async function deleteObjective(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { error } = await supabase.from("objectives").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
}


/* =========================================================
   PROJETS
   ========================================================= */

export async function getProjectsByObjective(objectiveId) {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("objective_id", objectiveId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data.map(mapProject);
}

export async function getAllProjects() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) throw error;
  return data.map(mapProject);
}


/* =========================================================
   RESSOURCES
   ========================================================= */

export async function getResourcesForTask(taskId) {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("user_id", user.id)
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map(mapResource);
}

export async function addResource({ taskId, projectId, objectiveId, type, title, url, content }) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data, error } = await supabase
    .from("resources")
    .insert({
      user_id: user.id,
      task_id: taskId || null,
      project_id: projectId || null,
      objective_id: objectiveId || null,
      type: type || "link",
      title: title || "",
      url: url || "",
      content: content || "",
    })
    .select()
    .single();

  if (error) throw error;
  return mapResource(data);
}

export async function deleteResource(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { error } = await supabase.from("resources").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
}


/* =========================================================
   PLAN D'ACTION — recommandation → objectif → projet → tâches
   ========================================================= */

export async function convertRecommendationToPlan({
  recommendationId,
  businessProfileId,
  objectiveTitle,
  projectTitle,
  tasks,
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  // ============================================================
  // 1. CRÉER L'OBJECTIF
  // ============================================================

  const { data: objective, error: objError } = await supabase
    .from("objectives")
    .insert({
      user_id: user.id,
      business_profile_id: businessProfileId || null,
      source_recommendation_id: recommendationId || null,
      title: objectiveTitle,
    })
    .select()
    .single();

  if (objError) throw objError;

  // ============================================================
  // 2. CRÉER LE PROJET
  // ============================================================

  const { data: project, error: projError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      objective_id: objective.id,
      title: projectTitle,
    })
    .select()
    .single();

  if (projError) throw projError;

  console.log(
    "________________ TASKS --------------",
    tasks
  );

  // ============================================================
  // 3. NORMALISER LES TÂCHES
  // ============================================================

  const cleanTasks = Array.isArray(tasks)
    ? tasks
        .map((task, index) => {
          // Ancien format : ["Tâche 1", "Tâche 2"]
          if (typeof task === "string") {
            const title = task.trim();

            if (!title) return null;

            return {
              title,
              description: "",
              priority: "medium",
              estimatedMinutes: null,
              deadlineDays: null,
              dependsOn: [],
              position: index,
            };
          }

          // Nouveau format :
          // {
          //   title,
          //   description,
          //   priority,
          //   estimatedMinutes,
          //   deadlineDays,
          //   dependsOn,
          //   order
          // }
          if (task && typeof task === "object") {
            const title =
              typeof task.title === "string"
                ? task.title.trim()
                : "";

            if (!title) return null;

            return {
              title,
              description:
                typeof task.description === "string"
                  ? task.description
                  : "",

              priority:
                ["high", "medium", "low"].includes(task.priority)
                  ? task.priority
                  : "medium",

              estimatedMinutes:
                Number.isInteger(task.estimatedMinutes)
                  ? task.estimatedMinutes
                  : null,

              deadlineDays:
                Number.isInteger(task.deadlineDays)
                  ? task.deadlineDays
                  : null,

              dependsOn: Array.isArray(task.dependsOn)
                ? task.dependsOn
                : [],

              position:
                Number.isInteger(task.order)
                  ? task.order
                  : index,
            };
          }

          return null;
        })
        .filter(Boolean)
    : [];

  console.log(
    "________________ CLEAN TASKS --------------",
    cleanTasks
  );

  // ============================================================
  // 4. CALCULER LES DATES D'ÉCHÉANCE
  // ============================================================

  const calculateDueDate = (deadlineDays) => {
    if (
      !Number.isInteger(deadlineDays) ||
      deadlineDays < 0
    ) {
      return null;
    }

    const date = new Date();

    date.setDate(
      date.getDate() + deadlineDays
    );

    return date.toISOString().split("T")[0];
  };

  // ============================================================
  // 5. CRÉER LES TÂCHES
  // ============================================================

  if (cleanTasks.length) {
    const taskPayload = cleanTasks.map((task, index) => ({
      user_id: user.id,

      title: task.title,

      description: task.description,

      category: "Projet",

      status: "todo",

      priority: task.priority,

      priority_color:
        task.priority === "high"
          ? "secondary"
          : task.priority === "low"
            ? "muted"
            : "accent",

      position:
        Number.isInteger(task.position)
          ? task.position
          : index,

      objective_id: objective.id,

      project_id: project.id,

      source_recommendation_id:
        recommendationId || null,

      estimated_minutes:
        task.estimatedMinutes,

      due_date:
        calculateDueDate(task.deadlineDays),

      // Les dépendances seront résolues après insertion
      depends_on_task_id: null,
    }));

    console.log(
      "________________ TASK PAYLOAD --------------",
      taskPayload
    );

    const {
      data: createdTasks,
      error: taskError,
    } = await supabase
      .from("tasks")
      .insert(taskPayload)
      .select();

    if (taskError) throw taskError;

    // ==========================================================
    // 6. RÉSOUDRE LES DÉPENDANCES
    // ==========================================================

    if (createdTasks?.length) {
      for (let i = 0; i < cleanTasks.length; i++) {
        const task = cleanTasks[i];

        if (!Array.isArray(task.dependsOn)) {
          continue;
        }

        if (!task.dependsOn.length) {
          continue;
        }

        /*
         * On suppose ici que dependsOn contient
         * l'ordre de la tâche dépendante.
         *
         * Exemple :
         *
         * tâche 2 :
         * dependsOn: [1]
         *
         * signifie que la tâche 2 dépend
         * de la tâche ayant order = 1.
         */

        const dependencyOrder = task.dependsOn[0];

        const dependencyTask =
          createdTasks.find(
            (createdTask) =>
              createdTask.position === dependencyOrder
          );

        if (!dependencyTask) {
          continue;
        }

        await supabase
          .from("tasks")
          .update({
            depends_on_task_id:
              dependencyTask.id,
          })
          .eq("id", createdTasks[i].id)
          .eq("user_id", user.id);
      }
    }
  }

  // ============================================================
  // 7. MARQUER LA RECOMMANDATION COMME CONVERTIE
  // ============================================================

  if (recommendationId) {
    const {
      error: recoError,
    } = await supabase
      .from("business_diagnostic_recommendations")
      .update({
        converted_to_objective_id: objective.id,
      })
      .eq("id", recommendationId)
      .eq("user_id", user.id);

    if (recoError) throw recoError;
  }

  // ============================================================
  // 8. RETOUR
  // ============================================================

  return {
    objective: mapObjective(objective),
    project: mapProject(project),
    taskCount: cleanTasks.length,
  };
}


export async function generatePlanAction({
  recommendation,
  profile,
}) {
  const { data, error } = await supabase.functions.invoke(
    "business-ai-plan-action",
    {
      body: {
        recommendation,
        profile,
      },
    }
  );

  if (error) {
    throw error;
  }

  if (!data?.plan) {
    throw new Error(
      "Aucun plan d'action n'a été généré."
    );
  }

  return data.plan;
}