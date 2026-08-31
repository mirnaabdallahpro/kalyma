import { supabase } from "../lib/supabase";

/**
 * Récupère l'utilisateur authentifié.
 */
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

/**
 * Récupère le profil business de l'utilisateur.
 */
async function getBusinessProfile() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère le diagnostic courant.
 */
export async function getCurrentBusinessDiagnostic() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostics")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_current", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère un diagnostic.
 */
export async function getBusinessDiagnostic(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostics")
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
 * Récupère l'historique des diagnostics.
 */
export async function getBusinessDiagnostics() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostics")
    .select("*")
    .eq("user_id", user.id)
    .order("version", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Crée un diagnostic.
 */
export async function createBusinessDiagnostic(diagnostic) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const profile = await getBusinessProfile();

  if (!profile) {
    throw new Error("Profil business introuvable.");
  }

  const {
    data: lastDiagnostic,
    error: versionError,
  } = await supabase
    .from("business_diagnostics")
    .select("version")
    .eq("business_profile_id", profile.id)
    .order("version", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (versionError) {
    throw versionError;
  }

  const version = lastDiagnostic
    ? lastDiagnostic.version + 1
    : 1;

  const payload = {
    user_id: user.id,
    business_profile_id: profile.id,

    version,

    status: diagnostic.status ?? "draft",
    source: diagnostic.source ?? "ai",

    generated_by:
      diagnostic.generated_by ?? user.id,

    business_score:
      diagnostic.business_score ?? 0,

    synthesis_title:
      diagnostic.synthesis_title ?? "",

    synthesis_description:
      diagnostic.synthesis_description ?? "",

    strength_dimension:
      diagnostic.strength_dimension ?? null,

    strength_score:
      diagnostic.strength_score ?? null,

    priority_dimension:
      diagnostic.priority_dimension ?? null,

    priority_score:
      diagnostic.priority_score ?? null,

    next_action_title:
      diagnostic.next_action_title ?? null,

    next_action_description:
      diagnostic.next_action_description ?? null,

    input_snapshot:
      diagnostic.input_snapshot ?? {},

    ai_provider:
      diagnostic.ai_provider ?? null,

    ai_model:
      diagnostic.ai_model ?? null,

    generation_started_at:
      diagnostic.generation_started_at ?? null,

    generated_at:
      diagnostic.generated_at ?? null,

    is_current:
      diagnostic.is_current ?? false,
  };

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostics")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Met à jour un diagnostic.
 */
export async function updateBusinessDiagnostic(
  id,
  updates
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const allowedFields = [
    "status",
    "business_score",
    "synthesis_title",
    "synthesis_description",
    "strength_dimension",
    "strength_score",
    "priority_dimension",
    "priority_score",
    "next_action_title",
    "next_action_description",
    "input_snapshot",
    "ai_provider",
    "ai_model",
    "generation_started_at",
    "generated_at",
    "is_current",
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
    .from("business_diagnostics")
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
 * Définit un diagnostic comme diagnostic courant.
 */
export async function setCurrentBusinessDiagnostic(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const profile = await getBusinessProfile();

  if (!profile) {
    throw new Error("Profil business introuvable.");
  }

  // Retire le statut current des anciens diagnostics.
  const {
    error: resetError,
  } = await supabase
    .from("business_diagnostics")
    .update({
      is_current: false,
    })
    .eq("business_profile_id", profile.id)
    .eq("user_id", user.id);

  if (resetError) {
    throw resetError;
  }

  // Définit le nouveau diagnostic courant.
  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostics")
    .update({
      is_current: true,
      status: "ready",
      generated_at: new Date().toISOString(),
    })
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
 * Récupère le diagnostic courant complet de l'utilisateur
 * avec ses dimensions et recommandations.
 */
export async function getCurrentBusinessDiagnosticFull() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data: diagnostic,
    error: diagnosticError,
  } = await supabase
    .from("business_diagnostics")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_current", true)
    .maybeSingle();

  if (diagnosticError) {
    throw diagnosticError;
  }

  if (!diagnostic) {
    return null;
  }

  const [
    dimensionsResult,
    recommendationsResult,
  ] = await Promise.all([
    supabase
      .from("business_diagnostic_dimensions")
      .select("*")
      .eq("diagnostic_id", diagnostic.id)
      .order("position", {
        ascending: true,
      }),

    supabase
      .from("business_diagnostic_recommendations")
      .select("*")
      .eq("diagnostic_id", diagnostic.id)
      .order("position", {
        ascending: true,
      }),
  ]);

  if (dimensionsResult.error) {
    throw dimensionsResult.error;
  }

  if (recommendationsResult.error) {
    throw recommendationsResult.error;
  }

  return {
    ...diagnostic,

    dimensions:
      dimensionsResult.data ?? [],

    recommendations:
      recommendationsResult.data ?? [],
  };
}
/**
 * Supprime un diagnostic.
 */
export async function deleteBusinessDiagnostic(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const {
    error,
  } = await supabase
    .from("business_diagnostics")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}

/**
 * Enregistre le feedback de l'utilisateur sur une recommandation IA.
 *
 * reason:
 * - too_generic
 * - already_done
 * - not_priority
 * - not_understood
 */
export async function createDiagnosticRecommendationFeedback({
  diagnosticId,
  recommendationKey,
  recommendationText,
  reason,
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  if (!diagnosticId) {
    throw new Error("Diagnostic introuvable.");
  }

  if (!recommendationKey) {
    throw new Error("Clé de recommandation requise.");
  }

  if (!recommendationText) {
    throw new Error("Texte de recommandation requis.");
  }

  if (!reason) {
    throw new Error("Motif du feedback requis.");
  }

  const allowedReasons = [
    "too_generic",
    "already_done",
    "not_priority",
    "not_understood",
  ];

  if (!allowedReasons.includes(reason)) {
    throw new Error("Motif de feedback invalide.");
  }

  const payload = {
    user_id: user.id,
    diagnostic_id: diagnosticId,
    recommendation_key: recommendationKey,
    recommendation_text: recommendationText,
    reason,
  };

  const { data, error } = await supabase
    .from("diagnostic_recommendation_feedback")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(
      "Erreur création feedback recommandation :",
      error
    );

    throw error;
  }

  return data;
}