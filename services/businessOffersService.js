import { supabase } from "../lib/supabase";

/**
 * Récupère l'utilisateur actuellement authentifié.
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
 * Récupère toutes les offres de l'utilisateur connecté.
 */
export async function getBusinessOffers() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_offers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Récupère une offre spécifique.
 */
export async function getBusinessOffer(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_offers")
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
 * Crée une nouvelle offre.
 */
export async function createBusinessOffer(offer) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const payload = {
    user_id: user.id,

    name: offer.name ?? "",
    description: offer.description ?? "",

    price: offer.price ?? null,
    currency: offer.currency ?? "MAD",

    billing_type:
      offer.billingType ?? "one_time",

    status:
      offer.status ?? "draft",

    category:
      offer.category ?? "",

    target:
      offer.target ?? "",

    duration:
      offer.duration ?? "",

    features:
      offer.features ?? [],

    notes:
      offer.notes ?? "",
  };

  const {
    data,
    error,
  } = await supabase
    .from("business_offers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Met à jour une offre.
 */
export async function updateBusinessOffer(
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

  if (updates.name !== undefined) {
    payload.name = updates.name;
  }

  if (updates.description !== undefined) {
    payload.description =
      updates.description;
  }

  if (updates.price !== undefined) {
    payload.price = updates.price;
  }

  if (updates.currency !== undefined) {
    payload.currency = updates.currency;
  }

  if (updates.billingType !== undefined) {
    payload.billing_type =
      updates.billingType;
  }

  if (updates.status !== undefined) {
    payload.status = updates.status;
  }

  if (updates.category !== undefined) {
    payload.category =
      updates.category;
  }

  if (updates.target !== undefined) {
    payload.target = updates.target;
  }

  if (updates.duration !== undefined) {
    payload.duration =
      updates.duration;
  }

  if (updates.features !== undefined) {
    payload.features =
      updates.features;
  }

  if (updates.notes !== undefined) {
    payload.notes = updates.notes;
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_offers")
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
 * Supprime une offre.
 */
export async function deleteBusinessOffer(id) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const {
    error,
  } = await supabase
    .from("business_offers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}

/**
 * Change uniquement le statut d'une offre.
 */
export async function updateBusinessOfferStatus(
  id,
  status
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error(
      "Utilisateur non authentifié."
    );
  }

  const allowedStatuses = [
    "draft",
    "active",
    "inactive",
    "archived",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      "Statut d'offre invalide."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_offers")
    .update({
      status,
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