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
 * Récupère toutes les dimensions d'un diagnostic.
 */
export async function getDiagnosticDimensions(diagnosticId) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_dimensions")
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
 * Récupère une dimension.
 */
export async function getDiagnosticDimension(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_dimensions")
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
 * Crée une dimension.
 */
export async function createDiagnosticDimension(
  diagnosticId,
  dimension
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

  const payload = {
    diagnostic_id: diagnosticId,

    user_id: user.id,

    business_profile_id:
      diagnostic.business_profile_id,

    dimension_key:
      dimension.dimension_key,

    name:
      dimension.name ?? "",

    status:
      dimension.status ?? "a_optimiser",

    score:
      dimension.score ?? 0,

    description:
      dimension.description ?? "",

    position:
      dimension.position ?? 0,
  };

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostic_dimensions")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Met à jour une dimension.
 */
export async function updateDiagnosticDimension(
  id,
  updates
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const allowedFields = [
    "dimension_key",
    "name",
    "status",
    "score",
    "description",
    "position",
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
    .from("business_diagnostic_dimensions")
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
 * Supprime une dimension.
 */
export async function deleteDiagnosticDimension(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const {
    error,
  } = await supabase
    .from("business_diagnostic_dimensions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}