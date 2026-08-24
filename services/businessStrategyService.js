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
      differentiators,

      icp_client_type,
      icp_persona,
      icp_role,
      icp_seniority,
      icp_decision_maker,

      icp_sector,
      icp_subsector,
      icp_niche,
      icp_micro_niche,
      icp_company_type,
      icp_size,
      icp_employee_count,
      icp_company_age,
      icp_structure,
      icp_business_model,

      icp_revenue,
      icp_revenue_growth,
      icp_profitability,
      icp_budget,
      icp_purchasing_power,
      icp_average_ticket,
      icp_lifetime_value,
      icp_recurrence_potential,
      icp_upsell_potential,

      icp_geography,
      icp_country,
      icp_region,
      icp_city,
      icp_languages,
      icp_market,
      icp_market_priority,
      icp_remote_possible,
      icp_physical_presence_required,
      icp_timezone,

      icp_business_stage,
      icp_organizational_maturity,
      icp_digital_maturity,
      icp_sales_maturity,
      icp_marketing_maturity,

      icp_current_situation,
      icp_growth_context,
      icp_current_challenges,
      icp_buying_trigger,
      icp_urgency_level,

      icp_primary_problem,
      icp_secondary_problems,
      icp_pain_points,
      icp_problem_causes,
      icp_problem_consequences,
      icp_cost_of_inaction,

      icp_business_goals,
      icp_measurable_goals,
      icp_desired_outcomes,
      icp_growth_objectives,

      icp_search_channels,
      icp_content_consumption,
      icp_online_behavior,
      icp_research_behavior,
      icp_social_platforms,

      icp_buying_behavior,
      icp_decision_process,
      icp_decision_duration,
      icp_decision_makers_count,
      icp_influencers,
      icp_users,
      icp_prescribers,
      icp_sales_cycle,

      icp_buying_criteria,
      icp_primary_buying_criterion,
      icp_roi_expectation,
      icp_proof_requirements,

      icp_objections,
      icp_price_sensitivity,
      icp_trust_barriers,
      icp_change_resistance,

      icp_buying_signals,
      icp_intent_level,
      icp_intent_score,

      icp_values,
      icp_motivations,
      icp_fears,
      icp_aspirations,
      icp_personality_traits,

      icp_ideal_fit,
      icp_fit_score,
      icp_strategic_value,
      icp_delivery_fit,
      icp_profitability_potential,
      icp_long_term_potential,
      icp_referral_potential,

      icp_qualification_criteria,
      icp_disqualification_criteria,
      icp_priority_level,
      icp_overall_score
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