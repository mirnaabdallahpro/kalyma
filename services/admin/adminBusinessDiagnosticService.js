import { supabase } from "../../lib/supabase";


/**
 * Récupère le diagnostic avec ses dimensions
 * et ses recommandations.
 */
export async function getAdminBusinessDiagnosticDetail(
  diagnosticId
) {
  if (!diagnosticId) {
    throw new Error(
      "Identifiant du diagnostic manquant."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("business_diagnostics")
    .select(`
      *,

      business_diagnostic_dimensions (
        *
      ),

      business_diagnostic_recommendations (
        *
      )
    `)
    .eq("id", diagnosticId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}


/**
 * Crée un nouveau diagnostic.
 *
 * La création du diagnostic principal
 * et des éléments détaillés est effectuée
 * séparément.
 */
export async function createAdminBusinessDiagnostic(
  clientId,
  diagnostic
) {
  if (!clientId) {
    throw new Error(
      "Identifiant client manquant."
    );
  }

  if (!diagnostic) {
    throw new Error(
      "Données du diagnostic manquantes."
    );
  }


  // Récupération du profil Business
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("business_profiles")
    .select("id, user_id")
    .eq("id", clientId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    throw new Error(
      "Profil business introuvable."
    );
  }


  // Récupération de la dernière version
  const {
    data: lastDiagnostic,
    error: versionError,
  } = await supabase
    .from("business_diagnostics")
    .select("version")
    .eq(
      "business_profile_id",
      profile.id
    )
    .order("version", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (versionError) {
    throw versionError;
  }


  const version =
    lastDiagnostic
      ? Number(
          lastDiagnostic.version
        ) + 1
      : 1;


  // Tous les anciens diagnostics
  // ne sont plus courants.
  const {
    error: resetError,
  } = await supabase
    .from("business_diagnostics")
    .update({
      is_current: false,
    })
    .eq(
      "business_profile_id",
      profile.id
    );

  if (resetError) {
    throw resetError;
  }


  // Création du diagnostic principal
  const {
    data: createdDiagnostic,
    error: diagnosticError,
  } = await supabase
    .from("business_diagnostics")
    .insert({
      user_id: profile.user_id,

      business_profile_id:
        profile.id,

      version,

      status:
        diagnostic.status ??
        "ready",

      source:
        diagnostic.source ??
        "admin",

      generated_by:
        diagnostic.generated_by ??
        null,

      business_score:
        diagnostic.business_score ??
        0,

      synthesis_title:
        diagnostic.synthesis_title ??
        "",

      synthesis_description:
        diagnostic.synthesis_description ??
        "",

      strength_dimension:
        diagnostic.strength_dimension ??
        null,

      strength_score:
        diagnostic.strength_score ??
        null,

      priority_dimension:
        diagnostic.priority_dimension ??
        null,

      priority_score:
        diagnostic.priority_score ??
        null,

      next_action_title:
        diagnostic.next_action_title ??
        null,

      next_action_description:
        diagnostic.next_action_description ??
        null,

      input_snapshot:
        diagnostic.input_snapshot ??
        {},

      ai_provider:
        diagnostic.ai_provider ??
        null,

      ai_model:
        diagnostic.ai_model ??
        null,

      generation_started_at:
        diagnostic.generation_started_at ??
        null,

      generated_at:
        diagnostic.generated_at ??
        new Date().toISOString(),

      is_current: true,
    })
    .select()
    .single();


  if (diagnosticError) {
    throw diagnosticError;
  }


  /*
   * Dimensions
   */

  if (
    Array.isArray(
      diagnostic.dimensions
    ) &&
    diagnostic.dimensions.length > 0
  ) {

    const allowedStatuses = [
  "solide",
  "a_optimiser",
  "prioritaire",
  "critique",
];
    const dimensions =
      diagnostic.dimensions.map(
        (dimension, index) => ({
          diagnostic_id:
            createdDiagnostic.id,

          user_id: profile.user_id,
          business_profile_id: profile.id,

          dimension_key:
            dimension.key ??
            null,

          name:
            dimension.label ??
            "",

          score: Math.min(
      100,
      Math.max(
        0,
        Number(dimension.score) || 0
      )
    ),

          status: allowedStatuses.includes(dimension.status)
      ? dimension.status
      : "a_optimiser",

          description:
            dimension.description ??
            "",

          position: index,
        })
      );

 console.log(
  "🔎 STATUTS DIMENSIONS :",
  diagnostic.dimensions.map(d => ({
    key: d.key,
    status: d.status,
  }))
);


    const {
      error:
        dimensionsError,
    } = await supabase
      .from(
        "business_diagnostic_dimensions"
      )
      .insert(dimensions);


    if (dimensionsError) {
      throw dimensionsError;
    }
  }


  /*
   * Recommandations
   */

  if (
    Array.isArray(
      diagnostic.recommendations
    ) &&
    diagnostic.recommendations.length > 0
  ) {
    
    const allowedPriorities = [
  "priority",
  "work_on",
  "optional",
];

const allowedImpacts = [
  "high",
  "medium",
  "low",
];

const allowedStatuses = [
  "todo",
  "in_progress",
  "done",
];

const recommendations =
  diagnostic.recommendations.map(
    (recommendation, index) => ({
      diagnostic_id:
        createdDiagnostic.id,

      user_id:
        profile.user_id,

      business_profile_id:
        profile.id,

      dimension_key:
        recommendation.dimension_key ?? null,

      title:
        recommendation.title ?? "",

      description:
        recommendation.description ?? "",

      priority:
        allowedPriorities.includes(
          recommendation.priority
        )
          ? recommendation.priority
          : "work_on",

      impact:
        allowedImpacts.includes(
          recommendation.impact
        )
          ? recommendation.impact
          : "medium",

      position: index,

      status:
        allowedStatuses.includes(
          recommendation.status
        )
          ? recommendation.status
          : "todo",
    })
  );


    const {
      error:
        recommendationsError,
    } = await supabase
      .from(
        "business_diagnostic_recommendations"
      )
      .insert(
        recommendations
      );


    if (
      recommendationsError
    ) {
      throw recommendationsError;
    }
  }


  return createdDiagnostic;
}