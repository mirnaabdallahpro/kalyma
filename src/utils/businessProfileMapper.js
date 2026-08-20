export function mapBusinessProfile(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,

    companyName: row.company_name,
    sector: row.sector,
    location: row.location,
    stage: row.stage,

    description: row.description,

    vision: row.vision,
    mission: row.mission,
    ambition: row.ambition,

    positioning: row.positioning,
    category: row.category,

    problemSolved: row.problem_solved,
    differentiation: row.differentiation,

    valueProposition: row.value_proposition,
    valueScore: row.value_score,

    businessModel: row.business_model,

    revenueSources: row.revenue_sources || [],

    targetMarket: row.target_market,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}