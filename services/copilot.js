import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user || null;
}

export async function getWeeklyBriefing() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [relancesRes, meetingsTodayRes, tasksRes, objectivesRes, recoRes] = await Promise.all([
    supabase
      .from("prospect_relances")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lte("scheduled_at", endOfToday.toISOString()),
    supabase
      .from("meetings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "scheduled")
      .gte("scheduled_at", startOfToday.toISOString())
      .lt("scheduled_at", endOfToday.toISOString()),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "todo")
      .eq("priority", "high"),
    supabase
      .from("objectives")
      .select("id, deadline, status")
      .eq("user_id", user.id)
      .neq("status", "done"),
    supabase
      .from("business_diagnostic_recommendations")
      .select("id, title", { count: "exact" })
      .eq("user_id", user.id)
      .eq("status", "todo")
      .is("converted_to_objective_id", null)
      .order("created_at", { ascending: true })
      .limit(1),
  ]);

  if (relancesRes.error) throw relancesRes.error;
  if (meetingsTodayRes.error) throw meetingsTodayRes.error;
  if (tasksRes.error) throw tasksRes.error;
  if (objectivesRes.error) throw objectivesRes.error;
  if (recoRes.error) throw recoRes.error;

  const today = new Date();
  const lateObjectives = (objectivesRes.data || []).filter(
    (o) => o.deadline && new Date(o.deadline) < today
  ).length;

  return {
    relancesToday: relancesRes.count || 0,
    meetingsToday: meetingsTodayRes.count || 0,
    highPriorityTasks: tasksRes.count || 0,
    lateObjectives,
    pendingRecommendation: recoRes.data?.[0]?.title || null,
  };
}