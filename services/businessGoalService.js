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
 * Récupère tous les objectifs.
 */
export async function getBusinessGoals() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_goals")
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
 * Récupère un objectif.
 */
export async function getBusinessGoal(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_goals")
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
 * Crée un objectif.
 */
export async function createBusinessGoal(goal) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const profile =
    await getBusinessProfile();

  if (!profile) {
    throw new Error(
      "Profil business introuvable."
    );
  }

  const {
    data: lastGoal,
    error: positionError,
  } = await supabase
    .from("business_goals")
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

  const position =
    lastGoal
      ? lastGoal.position + 1
      : 0;

  const payload = {
    user_id: user.id,

    business_profile_id:
      profile.id,

    title:
      goal.title ?? "",

    target:
      goal.target ?? null,

    current:
      goal.current ?? 0,

    deadline:
      goal.deadline ?? "",

    status:
      goal.status ?? "in_progress",

    color:
      goal.color ?? "primary",

    position,
  };

  const {
    data,
    error,
  } = await supabase
    .from("business_goals")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


/**
 * Met à jour un objectif.
 */
export async function updateBusinessGoal(
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

  if (updates.target !== undefined) {
    payload.target = updates.target;
  }

  if (updates.current !== undefined) {
    payload.current = updates.current;
  }

  if (updates.deadline !== undefined) {
    payload.deadline =
      updates.deadline;
  }

  if (updates.status !== undefined) {
    payload.status =
      updates.status;
  }

  if (updates.color !== undefined) {
    payload.color =
      updates.color;
  }

  if (updates.position !== undefined) {
    payload.position =
      updates.position;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_goals")
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
 * Supprime un objectif.
 */
export async function deleteBusinessGoal(
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
    .from("business_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}