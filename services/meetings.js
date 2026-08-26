import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user || null;
}

const OUTCOME_NEXT_TASK = {
  qualifie: (companyName) => `Préparer le RDV suivant avec ${companyName}`,
  a_relancer: (companyName) => `Relancer ${companyName}`,
  proposition_envoyee: (companyName) => `Suivre la proposition envoyée à ${companyName}`,
  pas_interesse: null,
  gagne: (companyName) => `Préparer l'onboarding de ${companyName}`,
  perdu: null,
};

function mapMeeting(row) {
  return {
    id: row.id,
    prospectId: row.prospect_id,
    title: row.title,
    objective: row.objective,
    scheduledAt: row.scheduled_at,
    videoLink: row.video_link,
    prepNotes: row.prep_notes,
    status: row.status,
    outcome: row.outcome,
    outcomeNotes: row.outcome_notes,
    nextActionTaskId: row.next_action_task_id,
    companyName: row.prospects?.company_name || "",
    contactName: row.prospects?.contact_name || "",
  };
}

export async function getMeetings() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("meetings")
    .select("*, prospects(company_name, contact_name)")
    .eq("user_id", user.id)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return data.map(mapMeeting);
}

export async function scheduleMeeting(form) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data, error } = await supabase
    .from("meetings")
    .insert({
      user_id: user.id,
      prospect_id: form.prospectId,
      title: form.title || "Rendez-vous",
      objective: form.objective || "",
      scheduled_at: form.scheduledAt,
      video_link: form.videoLink || "",
      prep_notes: form.prepNotes || "",
    })
    .select("*, prospects(company_name, contact_name)")
    .single();

  if (error) throw error;
  return mapMeeting(data);
}

export async function updateMeeting(id, updates) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.objective !== undefined) payload.objective = updates.objective;
  if (updates.scheduledAt !== undefined) payload.scheduled_at = updates.scheduledAt;
  if (updates.videoLink !== undefined) payload.video_link = updates.videoLink;
  if (updates.prepNotes !== undefined) payload.prep_notes = updates.prepNotes;

  const { data, error } = await supabase
    .from("meetings")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, prospects(company_name, contact_name)")
    .single();

  if (error) throw error;
  return mapMeeting(data);
}

export async function deleteMeeting(id) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { error } = await supabase.from("meetings").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
}

// Compte-rendu : ferme le RDV, enregistre le résultat, et crée
// automatiquement la tâche "prochaine action" quand pertinent.
export async function closeMeetingWithOutcome(id, { outcome, outcomeNotes }) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Utilisateur non authentifié.");

  const { data: meeting, error: fetchError } = await supabase
    .from("meetings")
    .select("*, prospects(company_name, contact_name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError) throw fetchError;

  let nextActionTaskId = null;
  const buildTitle = OUTCOME_NEXT_TASK[outcome];

  if (buildTitle) {
    const companyName = meeting.prospects?.company_name || "ce prospect";
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: buildTitle(companyName),
        category: "CRM",
        status: "todo",
        priority: "high",
        prospect_id: meeting.prospect_id,
      })
      .select()
      .single();

    if (taskError) throw taskError;
    nextActionTaskId = task.id;
  }

  const { data, error } = await supabase
    .from("meetings")
    .update({
      status: "done",
      outcome,
      outcome_notes: outcomeNotes || "",
      next_action_task_id: nextActionTaskId,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, prospects(company_name, contact_name)")
    .single();

  if (error) throw error;

  return { meeting: mapMeeting(data), nextActionCreated: Boolean(nextActionTaskId) };
}