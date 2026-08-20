import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session?.user ?? null;
}

/**
 * Récupère les recommandations d'un diagnostic.
 */
export async function getDiagnosticRecommendations(
  diagnosticId
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .select("*")
    .eq("diagnostic_id", diagnosticId)
    .eq("user_id", user.id)
    .order("position", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Récupère une recommandation.
 */
export async function getDiagnosticRecommendation(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Crée une recommandation.
 */
export async function createDiagnosticRecommendation(
  diagnosticId,
  recommendation
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const {
    data: diagnostic,
    error: diagnosticError,
  } = await supabase
    .from("business_diagnostics")
    .select("business_profile_id")
    .eq("id", diagnosticId)
    .eq("user_id", user.id)
    .single();

  if (diagnosticError) {
    throw diagnosticError;
  }

  const {
    data: lastRecommendation,
    error: positionError,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .select("position")
    .eq("diagnostic_id", diagnosticId)
    .eq("user_id", user.id)
    .order("position", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    throw positionError;
  }

  const position = lastRecommendation
    ? lastRecommendation.position + 1
    : 0;

  const payload = {
    diagnostic_id: diagnosticId,

    user_id: user.id,

    business_profile_id:
      diagnostic.business_profile_id,

    dimension_key:
      recommendation.dimension_key ?? null,

    title:
      recommendation.title ?? "",

    description:
      recommendation.description ?? "",

    priority:
      recommendation.priority ?? "work_on",

    impact:
      recommendation.impact ?? "medium",

    position,

    status:
      recommendation.status ?? "todo",
  };

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Met à jour une recommandation.
 */
export async function updateDiagnosticRecommendation(
  id,
  updates
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const allowedFields = [
    "dimension_key",
    "title",
    "description",
    "priority",
    "impact",
    "position",
    "status",
  ];

  const payload = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      payload[field] = updates[field];
    }
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Supprime une recommandation.
 */
export async function deleteDiagnosticRecommendation(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const {
    error,
  } = await supabase
    .from("business_diagnostic_recommendations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}