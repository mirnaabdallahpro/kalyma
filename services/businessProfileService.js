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

export async function getBusinessProfile() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createBusinessProfile() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const payload = {
    user_id: user.id,

    company_name: "",
    sector: "",
    location: "",
    stage: "",

    description: "",

    vision: "",
    mission: "",
    ambition: "",

    positioning: "",
    category: "",

    problem_solved: "",
    differentiation: "",

    value_proposition: "",

    value_score: 0,

    business_model: "",

    revenue_sources: [],

    target_market: "",
    icp_sector: "",
    icp_size: "",
    icp_revenue: "",
    icp_geography: "",

    differentiators: [],
  };

  const {
    data,
    error,
  } = await supabase
    .from("business_profiles")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBusinessProfile(updates) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const payload = {};

  // =========================================
  // BUSINESS PROFILE
  // =========================================

  if (updates.companyName !== undefined) {
    payload.company_name = updates.companyName;
  }

  if (updates.sector !== undefined) {
    payload.sector = updates.sector;
  }

  if (updates.location !== undefined) {
    payload.location = updates.location;
  }

  if (updates.stage !== undefined) {
    payload.stage = updates.stage;
  }

  if (updates.description !== undefined) {
    payload.description = updates.description;
  }

  if (updates.vision !== undefined) {
    payload.vision = updates.vision;
  }

  if (updates.mission !== undefined) {
    payload.mission = updates.mission;
  }

  if (updates.ambition !== undefined) {
    payload.ambition = updates.ambition;
  }

  if (updates.positioning !== undefined) {
    payload.positioning = updates.positioning;
  }

  if (updates.category !== undefined) {
    payload.category = updates.category;
  }

  if (updates.problemSolved !== undefined) {
    payload.problem_solved = updates.problemSolved;
  }

  if (updates.differentiation !== undefined) {
    payload.differentiation = updates.differentiation;
  }

  if (updates.valueProposition !== undefined) {
    payload.value_proposition = updates.valueProposition;
  }

  if (updates.businessModel !== undefined) {
    payload.business_model = updates.businessModel;
  }

  if (updates.revenueSources !== undefined) {
    payload.revenue_sources = updates.revenueSources;
  }

  if (updates.targetMarket !== undefined) {
    payload.target_market = updates.targetMarket;
  }

  // =========================================
  // ICP
  // =========================================

  // -----------------------------------------
  // 1. IDENTITÉ DU CLIENT
  // -----------------------------------------

  if (updates.icpClientType !== undefined) {
    payload.icp_client_type = updates.icpClientType;
  }

  if (updates.icpPersona !== undefined) {
    payload.icp_persona = updates.icpPersona;
  }

  if (updates.icpRole !== undefined) {
    payload.icp_role = updates.icpRole;
  }

  if (updates.icpSeniority !== undefined) {
    payload.icp_seniority = updates.icpSeniority;
  }

  if (updates.icpDecisionMaker !== undefined) {
    payload.icp_decision_maker = updates.icpDecisionMaker;
  }

  // -----------------------------------------
  // 2. SECTEUR / MARCHÉ
  // -----------------------------------------

  if (updates.icpSector !== undefined) {
    payload.icp_sector = updates.icpSector;
  }

  if (updates.icpSubsector !== undefined) {
    payload.icp_subsector = updates.icpSubsector;
  }

  if (updates.icpNiche !== undefined) {
    payload.icp_niche = updates.icpNiche;
  }

  if (updates.icpMicroNiche !== undefined) {
    payload.icp_micro_niche = updates.icpMicroNiche;
  }

  if (updates.icpCompanyType !== undefined) {
    payload.icp_company_type = updates.icpCompanyType;
  }

  if (updates.icpSize !== undefined) {
    payload.icp_size = updates.icpSize;
  }

  if (updates.icpEmployeeCount !== undefined) {
    payload.icp_employee_count = updates.icpEmployeeCount;
  }

  if (updates.icpCompanyAge !== undefined) {
    payload.icp_company_age = updates.icpCompanyAge;
  }

  if (updates.icpStructure !== undefined) {
    payload.icp_structure = updates.icpStructure;
  }

  if (updates.icpBusinessModel !== undefined) {
    payload.icp_business_model = updates.icpBusinessModel;
  }

  // -----------------------------------------
  // 3. PROFIL ÉCONOMIQUE
  // -----------------------------------------

  if (updates.icpRevenue !== undefined) {
    payload.icp_revenue = updates.icpRevenue;
  }

  if (updates.icpRevenueGrowth !== undefined) {
    payload.icp_revenue_growth = updates.icpRevenueGrowth;
  }

  if (updates.icpProfitability !== undefined) {
    payload.icp_profitability = updates.icpProfitability;
  }

  if (updates.icpBudget !== undefined) {
    payload.icp_budget = updates.icpBudget;
  }

  if (updates.icpPurchasingPower !== undefined) {
    payload.icp_purchasing_power = updates.icpPurchasingPower;
  }

  if (updates.icpAverageTicket !== undefined) {
    payload.icp_average_ticket = updates.icpAverageTicket;
  }

  if (updates.icpLifetimeValue !== undefined) {
    payload.icp_lifetime_value = updates.icpLifetimeValue;
  }

  if (updates.icpRecurrencePotential !== undefined) {
  payload.icp_recurrence_potential = updates.icpRecurrencePotential;
}

if (updates.icpUpsellPotential !== undefined) {
  payload.icp_upsell_potential = updates.icpUpsellPotential;
}

  // -----------------------------------------
  // 4. GÉOGRAPHIE
  // -----------------------------------------

  if (updates.icpGeography !== undefined) {
    payload.icp_geography = updates.icpGeography;
  }

  if (updates.icpCountry !== undefined) {
    payload.icp_country = updates.icpCountry;
  }

  if (updates.icpRegion !== undefined) {
    payload.icp_region = updates.icpRegion;
  }

  if (updates.icpCity !== undefined) {
    payload.icp_city = updates.icpCity;
  }

  if (updates.icpLanguages !== undefined) {
    payload.icp_languages = updates.icpLanguages;
  }

  if (updates.icpRemotePossible !== undefined) {
  payload.icp_remote_possible = updates.icpRemotePossible;
}

if (updates.icpPhysicalPresenceRequired !== undefined) {
  payload.icp_physical_presence_required =
    updates.icpPhysicalPresenceRequired;
}

if (updates.icpTimezone !== undefined) {
  payload.icp_timezone = updates.icpTimezone;
}

if (updates.icpMarketPriority !== undefined) {
  payload.icp_market_priority = updates.icpMarketPriority;
}
  // -----------------------------------------
  // 5. MATURITÉ
  // -----------------------------------------

  if (updates.icpBusinessStage !== undefined) {
    payload.icp_business_stage = updates.icpBusinessStage;
  }

  if (updates.icpOrganizationalMaturity !== undefined) {
    payload.icp_organizational_maturity =
      updates.icpOrganizationalMaturity;
  }

  if (updates.icpDigitalMaturity !== undefined) {
    payload.icp_digital_maturity =
      updates.icpDigitalMaturity;
  }

  if (updates.icpSalesMaturity !== undefined) {
    payload.icp_sales_maturity =
      updates.icpSalesMaturity;
  }

  if (updates.icpMarketingMaturity !== undefined) {
    payload.icp_marketing_maturity =
      updates.icpMarketingMaturity;
  }

  // -----------------------------------------
  // 6. SITUATION / CONTEXTE
  // -----------------------------------------

  if (updates.icpCurrentSituation !== undefined) {
    payload.icp_current_situation =
      updates.icpCurrentSituation;
  }

  if (updates.icpGrowthContext !== undefined) {
    payload.icp_growth_context =
      updates.icpGrowthContext;
  }

  if (updates.icpCurrentChallenges !== undefined) {
    payload.icp_current_challenges =
      updates.icpCurrentChallenges;
  }

  if (updates.icpBuyingTrigger !== undefined) {
    payload.icp_buying_trigger =
      updates.icpBuyingTrigger;
  }

  if (updates.icpUrgencyLevel !== undefined) {
    payload.icp_urgency_level =
      updates.icpUrgencyLevel;
  }

  // -----------------------------------------
  // 7. PROBLÈMES / PAINS
  // -----------------------------------------

  if (updates.icpPrimaryProblem !== undefined) {
    payload.icp_primary_problem =
      updates.icpPrimaryProblem;
  }

  if (updates.icpSecondaryProblems !== undefined) {
    payload.icp_secondary_problems =
      updates.icpSecondaryProblems;
  }

  if (updates.icpPainPoints !== undefined) {
    payload.icp_pain_points =
      updates.icpPainPoints;
  }

  if (updates.icpProblemCauses !== undefined) {
    payload.icp_problem_causes =
      updates.icpProblemCauses;
  }

  if (updates.icpProblemConsequences !== undefined) {
    payload.icp_problem_consequences =
      updates.icpProblemConsequences;
  }

  if (updates.icpCostOfInaction !== undefined) {
    payload.icp_cost_of_inaction =
      updates.icpCostOfInaction;
  }

  // -----------------------------------------
  // 8. OBJECTIFS
  // -----------------------------------------

  if (updates.icpBusinessGoals !== undefined) {
    payload.icp_business_goals =
      updates.icpBusinessGoals;
  }

  if (updates.icpMeasurableGoals !== undefined) {
    payload.icp_measurable_goals =
      updates.icpMeasurableGoals;
  }

  if (updates.icpDesiredOutcomes !== undefined) {
    payload.icp_desired_outcomes =
      updates.icpDesiredOutcomes;
  }

  if (updates.icpGrowthObjectives !== undefined) {
  payload.icp_growth_objectives = updates.icpGrowthObjectives;
}
  // -----------------------------------------
  // 9. RECHERCHE / COMPORTEMENT DIGITAL
  // -----------------------------------------

  if (updates.icpSearchChannels !== undefined) {
    payload.icp_search_channels =
      updates.icpSearchChannels;
  }

  if (updates.icpContentConsumption !== undefined) {
    payload.icp_content_consumption =
      updates.icpContentConsumption;
  }

  if (updates.icpOnlineBehavior !== undefined) {
    payload.icp_online_behavior =
      updates.icpOnlineBehavior;
  }

  if (updates.icpResearchBehavior !== undefined) {
    payload.icp_research_behavior =
      updates.icpResearchBehavior;
  }

  if (updates.icpSocialPlatforms !== undefined) {
    payload.icp_social_platforms =
      updates.icpSocialPlatforms;
  }

  // -----------------------------------------
  // 10. COMPORTEMENT D'ACHAT
  // -----------------------------------------

  if (updates.icpBuyingBehavior !== undefined) {
    payload.icp_buying_behavior =
      updates.icpBuyingBehavior;
  }

  if (updates.icpDecisionProcess !== undefined) {
    payload.icp_decision_process =
      updates.icpDecisionProcess;
  }

  if (updates.icpDecisionDuration !== undefined) {
    payload.icp_decision_duration =
      updates.icpDecisionDuration;
  }

  if (updates.icpDecisionMakersCount !== undefined) {
    payload.icp_decision_makers_count =
      updates.icpDecisionMakersCount;
  }

  if (updates.icpInfluencers !== undefined) {
    payload.icp_influencers =
      updates.icpInfluencers;
  }

  if (updates.icpUsers !== undefined) {
    payload.icp_users =
      updates.icpUsers;
  }

  if (updates.icpPrescribers !== undefined) {
    payload.icp_prescribers =
      updates.icpPrescribers;
  }

  if (updates.icpSalesCycle !== undefined) {
    payload.icp_sales_cycle =
      updates.icpSalesCycle;
  }

  // -----------------------------------------
  // 11. CRITÈRES D'ACHAT
  // -----------------------------------------

  if (updates.icpBuyingCriteria !== undefined) {
    payload.icp_buying_criteria =
      updates.icpBuyingCriteria;
  }

  if (updates.icpPrimaryBuyingCriterion !== undefined) {
    payload.icp_primary_buying_criterion =
      updates.icpPrimaryBuyingCriterion;
  }

  if (updates.icpRoiExpectation !== undefined) {
    payload.icp_roi_expectation =
      updates.icpRoiExpectation;
  }

  if (updates.icpProofRequirements !== undefined) {
    payload.icp_proof_requirements =
      updates.icpProofRequirements;
  }

  // -----------------------------------------
  // 12. OBJECTIONS / FREINS
  // -----------------------------------------

  if (updates.icpObjections !== undefined) {
    payload.icp_objections =
      updates.icpObjections;
  }

  if (updates.icpPriceSensitivity !== undefined) {
    payload.icp_price_sensitivity =
      updates.icpPriceSensitivity;
  }

  if (updates.icpTrustBarriers !== undefined) {
    payload.icp_trust_barriers =
      updates.icpTrustBarriers;
  }

  if (updates.icpChangeResistance !== undefined) {
    payload.icp_change_resistance =
      updates.icpChangeResistance;
  }

  // -----------------------------------------
  // 13. SIGNAUX D'ACHAT / INTENTION
  // -----------------------------------------

  if (updates.icpBuyingSignals !== undefined) {
    payload.icp_buying_signals =
      updates.icpBuyingSignals;
  }

  if (updates.icpIntentLevel !== undefined) {
    payload.icp_intent_level =
      updates.icpIntentLevel;
  }

  if (updates.icpIntentScore !== undefined) {
    payload.icp_intent_score =
      updates.icpIntentScore;
  }

  // -----------------------------------------
  // 14. PSYCHOLOGIE / MOTIVATIONS
  // -----------------------------------------

  if (updates.icpValues !== undefined) {
    payload.icp_values =
      updates.icpValues;
  }

  if (updates.icpMotivations !== undefined) {
    payload.icp_motivations =
      updates.icpMotivations;
  }

  if (updates.icpFears !== undefined) {
    payload.icp_fears =
      updates.icpFears;
  }

  if (updates.icpAspirations !== undefined) {
    payload.icp_aspirations =
      updates.icpAspirations;
  }

  if (updates.icpPersonalityTraits !== undefined) {
  payload.icp_personality_traits = updates.icpPersonalityTraits;
}

  // -----------------------------------------
  // 15. QUALIFICATION
  // -----------------------------------------

  if (updates.icpQualificationCriteria !== undefined) {
    payload.icp_qualification_criteria =
      updates.icpQualificationCriteria;
  }

  if (updates.icpDisqualificationCriteria !== undefined) {
    payload.icp_disqualification_criteria =
      updates.icpDisqualificationCriteria;
  }

  if (updates.icpPriorityLevel !== undefined) {
    payload.icp_priority_level =
      updates.icpPriorityLevel;
  }

  if (updates.icpFitScore !== undefined) {
    payload.icp_fit_score =
      updates.icpFitScore;
  }

  if (updates.icpIdealFit !== undefined) {
  payload.icp_ideal_fit = updates.icpIdealFit;
}

if (updates.icpStrategicValue !== undefined) {
  payload.icp_strategic_value = updates.icpStrategicValue;
}

if (updates.icpDeliveryFit !== undefined) {
  payload.icp_delivery_fit = updates.icpDeliveryFit;
}

if (updates.icpProfitabilityPotential !== undefined) {
  payload.icp_profitability_potential =
    updates.icpProfitabilityPotential;
}

if (updates.icpLongTermPotential !== undefined) {
  payload.icp_long_term_potential =
    updates.icpLongTermPotential;
}

if (updates.icpReferralPotential !== undefined) {
  payload.icp_referral_potential =
    updates.icpReferralPotential;
}


if (updates.icpOverallScore !== undefined) {
  payload.icp_overall_score = updates.icpOverallScore;
}
  // =========================================
  // DIFFERENTIATORS
  // =========================================

  if (updates.differentiators !== undefined) {
    payload.differentiators = updates.differentiators;
  }

  // =========================================
  // UPDATE SUPABASE
  // =========================================

  const {
    data,
    error,
  } = await supabase
    .from("business_profiles")
    .update(payload)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}