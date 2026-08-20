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

  if (updates.icpSector !== undefined) {
  payload.icp_sector = updates.icpSector;
}

if (updates.icpSize !== undefined) {
  payload.icp_size = updates.icpSize;
}

if (updates.icpRevenue !== undefined) {
  payload.icp_revenue = updates.icpRevenue;
}

if (updates.icpGeography !== undefined) {
  payload.icp_geography = updates.icpGeography;
}

if (updates.differentiators !== undefined) {
  payload.differentiators = updates.differentiators;
}

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