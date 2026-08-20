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
export async function getBusinessStrategyProfile() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_profiles")
    .select(`
      id,
      user_id,
      vision,
      mission,
      positioning,
      icp_sector,
      icp_size,
      icp_revenue,
      icp_geography,
      differentiators
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}


/**
 * Récupère les priorités stratégiques.
 */
export async function getBusinessStrategyPriorities() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_strategy_priorities")
    .select("*")
    .eq("user_id", user.id)
    .order("position", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}


/**
 * Crée une priorité stratégique.
 */
export async function createBusinessStrategyPriority(
  priority
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const profile =
    await getBusinessStrategyProfile();

  if (!profile) {
    throw new Error(
      "Profil business introuvable."
    );
  }

  const {
    data: lastPriority,
    error: positionError,
  } = await supabase
    .from("business_strategy_priorities")
    .select("position")
    .eq("user_id", user.id)
    .eq(
      "business_profile_id",
      profile.id
    )
    .order("position", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    throw positionError;
  }

  const nextPosition =
    lastPriority
      ? lastPriority.position + 1
      : 0;

  const payload = {
    user_id: user.id,

    business_profile_id:
      profile.id,

    title:
      priority.title ?? "",

    description:
      priority.description ?? "",

    priority:
      priority.priority ?? "medium",

    status:
      priority.status ?? "todo",

    position: nextPosition,
  };

  const {
    data,
    error,
  } = await supabase
    .from(
      "business_strategy_priorities"
    )
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


/**
 * Met à jour une priorité.
 */
export async function updateBusinessStrategyPriority(
  id,
  updates
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const payload = {};

  if (updates.title !== undefined) {
    payload.title = updates.title;
  }

  if (
    updates.description !== undefined
  ) {
    payload.description =
      updates.description;
  }

  if (updates.priority !== undefined) {
    payload.priority =
      updates.priority;
  }

  if (updates.status !== undefined) {
    payload.status =
      updates.status;
  }

  if (updates.position !== undefined) {
    payload.position =
      updates.position;
  }

  const {
    data,
    error,
  } = await supabase
    .from(
      "business_strategy_priorities"
    )
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
 * Change uniquement le statut.
 */
export async function updateBusinessStrategyPriorityStatus(
  id,
  status
) {
  const allowedStatuses = [
    "todo",
    "in_progress",
    "done",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      "Statut de priorité invalide."
    );
  }

  return updateBusinessStrategyPriority(
    id,
    { status }
  );
}


/**
 * Supprime une priorité.
 */
export async function deleteBusinessStrategyPriority(
  id
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const {
    error,
  } = await supabase
    .from(
      "business_strategy_priorities"
    )
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}