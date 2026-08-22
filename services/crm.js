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

const ACTIVE_STAGES = ["lead", "rdv", "proposition", "negociation"];
const DEFAULT_INTERVALS = [3, 7, 30];


/* =========================================================
   OFFRES — pour le sélecteur du formulaire prospect
   ========================================================= */

export async function getOffersForSelect() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("business_offers")
    .select("id, name, price, currency, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}


/* =========================================================
   PROSPECTS
   ========================================================= */

function mapProspect(row) {
  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    source: row.source,
    amount: row.amount,
    currency: row.currency,
    stage: row.stage,
    position: row.position,
    lostReason: row.lost_reason,
    notes: row.notes,
    closedAt: row.closed_at,
    createdAt: row.created_at,
    offer: row.business_offers
      ? {
          id: row.business_offers.id,
          name: row.business_offers.name,
          price: row.business_offers.price,
        }
      : null,
  };
}

export async function getProspects() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("prospects")
    .select("*, business_offers(id, name, price)")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) throw error;
  return data.map(mapProspect);
}

export async function createProspect(form) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const stage = form.stage || "lead";

  const { data: existing, error: fetchError } = await supabase
    .from("prospects")
    .select("position")
    .eq("user_id", user.id)
    .eq("stage", stage)
    .order("position", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextPosition = existing?.length ? existing[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("prospects")
    .insert({
      user_id: user.id,
      business_offer_id: form.offerId,
      company_name: form.companyName || "",
      contact_name: form.contactName || "",
      contact_email: form.contactEmail || "",
      contact_phone: form.contactPhone || "",
      source: form.source || "",
      amount: form.amount || null,
      currency: form.currency || "MAD",
      stage,
      position: nextPosition,
      notes: form.notes || "",
    })
    .select("*, business_offers(id, name, price)")
    .single();

  if (error) throw error;

  // Génère la séquence de relances (J3, J7, J30… selon la config)
  await generateRelancesForProspect(user.id, data.id, new Date(data.created_at));

  return mapProspect(data);
}

export async function updateProspect(id, updates) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const payload = {};

  if (updates.offerId !== undefined) payload.business_offer_id = updates.offerId;
  if (updates.companyName !== undefined) payload.company_name = updates.companyName;
  if (updates.contactName !== undefined) payload.contact_name = updates.contactName;
  if (updates.contactEmail !== undefined) payload.contact_email = updates.contactEmail;
  if (updates.contactPhone !== undefined) payload.contact_phone = updates.contactPhone;
  if (updates.source !== undefined) payload.source = updates.source;
  if (updates.amount !== undefined) payload.amount = updates.amount;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await supabase
    .from("prospects")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, business_offers(id, name, price)")
    .single();

  if (error) throw error;
  return mapProspect(data);
}

export async function deleteProspect(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { error } = await supabase
    .from("prospects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

// Réordonnancement au sein du pipeline actif (drag & drop, 4 colonnes)
export async function reorderProspects(orderedIds, movedId, newStage) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const updates = orderedIds.map((id, index) => {
    const payload = { position: index };
    if (id === movedId) payload.stage = newStage;

    return supabase
      .from("prospects")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id);
  });

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

export async function markProspectWon(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data, error } = await supabase
    .from("prospects")
    .update({ stage: "gagne", closed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, business_offers(id, name, price)")
    .single();

  if (error) throw error;

  await cancelPendingRelances(user.id, id);

  return mapProspect(data);
}

export async function markProspectLost(id, reason) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data, error } = await supabase
    .from("prospects")
    .update({
      stage: "perdu",
      closed_at: new Date().toISOString(),
      lost_reason: reason || "",
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, business_offers(id, name, price)")
    .single();

  if (error) throw error;

  await cancelPendingRelances(user.id, id);

  return mapProspect(data);
}

export { ACTIVE_STAGES };


/* =========================================================
   RELANCES — configuration
   ========================================================= */

export async function getRelanceSettings() {
  const user = await getAuthenticatedUser();
  if (!user) return { intervals: DEFAULT_INTERVALS, enabled: true };

  const { data, error } = await supabase
    .from("crm_relance_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return { intervals: DEFAULT_INTERVALS, enabled: true };
  }

  return { intervals: data.intervals, enabled: data.enabled };
}

export async function updateRelanceSettings({ intervals, enabled }) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data: existing, error: fetchError } = await supabase
    .from("crm_relance_settings")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase
      .from("crm_relance_settings")
      .update({ intervals, enabled })
      .eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("crm_relance_settings")
      .insert({ user_id: user.id, intervals, enabled });
    if (error) throw error;
  }

  return { intervals, enabled };
}


/* =========================================================
   RELANCES — génération automatique + suivi
   ========================================================= */

async function generateRelancesForProspect(userId, prospectId, fromDate) {
  const { data: settings, error: settingsError } = await supabase
    .from("crm_relance_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (settingsError) throw settingsError;

  if (settings && settings.enabled === false) return;

  const intervals = settings?.intervals?.length ? settings.intervals : DEFAULT_INTERVALS;

  const rows = intervals.map((dayOffset) => {
    const scheduled = new Date(fromDate);
    scheduled.setDate(scheduled.getDate() + dayOffset);

    return {
      user_id: userId,
      prospect_id: prospectId,
      day_offset: dayOffset,
      scheduled_at: scheduled.toISOString(),
      status: "pending",
    };
  });

  const { error } = await supabase.from("prospect_relances").insert(rows);
  if (error) throw error;
}

async function cancelPendingRelances(userId, prospectId) {
  const { error } = await supabase
    .from("prospect_relances")
    .update({ status: "skipped" })
    .eq("user_id", userId)
    .eq("prospect_id", prospectId)
    .eq("status", "pending");

  if (error) throw error;
}

function mapRelance(row) {
  return {
    id: row.id,
    prospectId: row.prospect_id,
    dayOffset: row.day_offset,
    scheduledAt: row.scheduled_at,
    status: row.status,
    note: row.note,
    companyName: row.prospects?.company_name || "",
    contactName: row.prospects?.contact_name || "",
  };
}

export async function getUpcomingRelances() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("prospect_relances")
    .select("*, prospects(company_name, contact_name)")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return data.map(mapRelance);
}

export async function completeRelance(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { error } = await supabase
    .from("prospect_relances")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function skipRelance(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { error } = await supabase
    .from("prospect_relances")
    .update({ status: "skipped" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
