import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import AIDiagnosticModal from "../../components/business/AIDiagnosticModal";
import BusinessCard from "../../components/business/BusinessCard";
import ComingSoonOverlay from "../../components/shared/ComingSoonOverlay";

import {
  getCurrentBusinessDiagnosticFull,
} from "../../../services/businessDiagnostics";

import { supabase } from "../../../lib/supabase";

function BusinessDiagnostics() {
  const [diagnostic, setDiagnostic] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    loadDiagnostic();
  }, []);

  async function loadDiagnostic() {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error(
          "Utilisateur non authentifié."
        );
      }

      /*
       * Récupération du profil business.
       */
      const {
        data: businessProfile,
        error: profileError,
      } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setProfile(businessProfile);

      /*
       * Récupération du diagnostic courant
       * + dimensions
       * + recommandations.
       */
      const currentDiagnostic =
        await getCurrentBusinessDiagnosticFull();

      setDiagnostic(currentDiagnostic);
    } catch (err) {
      console.error(
        "Erreur chargement diagnostic business :",
        err
      );

      setError(
        err?.message ||
          "Impossible de charger le diagnostic."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Point fort = meilleure dimension.
   */
  const strongestDimension = useMemo(() => {
    if (
      !diagnostic?.dimensions?.length
    ) {
      return null;
    }

    return [...diagnostic.dimensions].sort(
      (a, b) => b.score - a.score
    )[0];
  }, [diagnostic]);

  /*
   * Priorité = dimension avec le score
   * le plus faible.
   */
  const weakestDimension = useMemo(() => {
    if (
      !diagnostic?.dimensions?.length
    ) {
      return null;
    }

    return [...diagnostic.dimensions].sort(
      (a, b) => a.score - b.score
    )[0];
  }, [diagnostic]);

  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {
    return (
      <div className="business-diagnostics-page">
        <div className="business-page-header">
          <div>
            <span className="business-page-eyebrow">
              BUSINESS / DIAGNOSTIC
            </span>

            <h1>
              Diagnostic stratégique
            </h1>

            <p>
              Analysez la maturité actuelle de
              votre entreprise et identifiez
              vos prochains leviers de croissance.
            </p>
          </div>
        </div>

        <BusinessCard
          title="Diagnostic en cours de chargement"
          subtitle="Récupération de vos dernières données business."
        >
          <div className="diagnostic-loading">
            Chargement du diagnostic...
          </div>
        </BusinessCard>
      </div>
    );
  }

  /*
   * =========================================
   * ERROR
   * =========================================
   */

  if (error) {
    return (
      <div className="business-diagnostics-page">
        <div className="business-page-header">
          <div>
            <span className="business-page-eyebrow">
              BUSINESS / DIAGNOSTIC
            </span>

            <h1>
              Diagnostic stratégique
            </h1>

            <p>
              Analysez la maturité actuelle de
              votre entreprise et identifiez
              vos prochains leviers de croissance.
            </p>
          </div>
        </div>

        <BusinessCard
          title="Impossible de charger le diagnostic"
          subtitle="Une erreur est survenue lors de la récupération de vos données."
        >
          <div className="diagnostic-error">
            <p>{error}</p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={loadDiagnostic}
            >
              Réessayer
            </button>
          </div>
        </BusinessCard>
      </div>
    );
  }

  /*
   * =========================================
   * AUCUN DIAGNOSTIC
   * =========================================
   */

  if (!diagnostic) {
    return (
      <div className="business-diagnostics-page">
        <div className="business-page-header">
          <div>
            <span className="business-page-eyebrow">
              BUSINESS / DIAGNOSTIC
            </span>

            <h1>
              Diagnostic stratégique
            </h1>

            <p>
              Analysez la maturité actuelle de
              votre entreprise et identifiez
              vos prochains leviers de croissance.
            </p>
          </div>

          <ComingSoonOverlay>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setShowAnalysis(true)
            }
          >
            ✦ Analyse Kalyma AI
          </button>
          </ComingSoonOverlay>
        </div>

        <BusinessCard
          title="Votre diagnostic n'est pas encore disponible"
          subtitle="Complétez votre profil business afin de pouvoir générer votre diagnostic."
        >
          <ComingSoonOverlay>
        
          <div className="diagnostic-empty">
            <p>
              Votre diagnostic stratégique sera
              généré à partir des informations de
              votre profil business, de vos offres,
              de vos objectifs et de vos priorités.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setShowAnalysis(true)
              }
            >
              Générer mon diagnostic
            </button>
          </div>
          </ComingSoonOverlay>

        </BusinessCard>

        {showAnalysis && (
          <AIDiagnosticModal
            profile={profile}
            diagnostic={null}
            onClose={() =>
              setShowAnalysis(false)
            }
          />
        )}
      </div>
    );
  }

  /*
   * =========================================
   * DIAGNOSTIC DISPONIBLE
   * =========================================
   */

  return (
    <div className="business-diagnostics-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="business-page-header">
        <div>
          <span className="business-page-eyebrow">
            BUSINESS / DIAGNOSTIC
          </span>

          <h1>
            Diagnostic stratégique
          </h1>

          <p>
            Analysez la maturité actuelle de
            votre entreprise et identifiez
            vos prochains leviers de croissance.
          </p>
        </div>
        
        <ComingSoonOverlay>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            setShowAnalysis(true)
          }
          disabled={true}
        >
          ✦ Analyse Kalyma AI
        </button>
        </ComingSoonOverlay>
      </div>

      {/* =========================================
          SCORE OVERVIEW
      ========================================= */}

      <div className="diagnostic-overview">
        <div className="diagnostic-score-card">
          <div className="diagnostic-score-label">
            SCORE BUSINESS
          </div>

          <div className="diagnostic-score">
            {diagnostic.business_score}

            <span>/100</span>
          </div>

          <div className="diagnostic-score-status">
            <span className="diagnostic-status-dot" />

            {getBusinessScoreLabel(
              diagnostic.business_score
            )}
          </div>

          <div className="diagnostic-score-progress">
            <div
              style={{
                width: `${diagnostic.business_score}%`,
              }}
            />
          </div>

          <p>
            {diagnostic.generated_at
              ? `Dernier diagnostic : ${formatDiagnosticDate(
                  diagnostic.generated_at
                )}`
              : "Diagnostic disponible"}
          </p>
        </div>

        <div className="diagnostic-summary-card">
          <span className="diagnostic-section-label">
            SYNTHÈSE
          </span>

          <h2>
            {diagnostic.synthesis_title}
          </h2>

          <p>
            {diagnostic.synthesis_description}
          </p>

          <div className="diagnostic-highlights">
            <div>
              <span>
                Point fort
              </span>

              <strong>
                {strongestDimension
                  ? strongestDimension.name
                  : diagnostic.strength_dimension ||
                    "—"}
              </strong>

              <small>
                {strongestDimension
                  ? `${strongestDimension.score}/100`
                  : diagnostic.strength_score
                    ? `${diagnostic.strength_score}/100`
                    : "—"}
              </small>
            </div>

            <div>
              <span>
                Priorité
              </span>

              <strong>
                {weakestDimension
                  ? weakestDimension.name
                  : diagnostic.priority_dimension ||
                    "—"}
              </strong>

              <small>
                {weakestDimension
                  ? `${weakestDimension.score}/100`
                  : diagnostic.priority_score
                    ? `${diagnostic.priority_score}/100`
                    : "—"}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          DIMENSIONS
      ========================================= */}

      <BusinessCard
        title="Analyse des dimensions"
        subtitle="Évaluation des principaux fondamentaux de votre business."
      >
        <div className="diagnostic-dimensions">
          {diagnostic.dimensions?.length > 0 ? (
            diagnostic.dimensions.map(
              (dimension) => (
                <DiagnosticDimension
                  key={dimension.id}
                  dimension={dimension}
                />
              )
            )
          ) : (
            <div className="diagnostic-empty-state">
              Aucune dimension disponible.
            </div>
          )}
        </div>
      </BusinessCard>

      {/* =========================================
          RECOMMENDATIONS
      ========================================= */}

      <div className="diagnostic-lower-grid">
        <BusinessCard
          title="Recommandations"
          subtitle="Les actions prioritaires identifiées par Kalyma."
        >
          <div className="diagnostic-recommendations">
            {diagnostic.recommendations?.length >
            0 ? (
              diagnostic.recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <Recommendation
                    key={
                      recommendation.id
                    }
                    recommendation={
                      recommendation
                    }
                    index={index + 1}
                  />
                )
              )
            ) : (
              <div className="diagnostic-empty-state">
                Aucune recommandation disponible.
              </div>
            )}
          </div>
        </BusinessCard>

        <BusinessCard
          title="Prochaine action"
          subtitle="Le prochain levier à travailler."
        >
          <div className="diagnostic-next-action">
            <div className="diagnostic-next-icon">
              →
            </div>

            <div>
              <span>
                PRIORITÉ ACTUELLE
              </span>

              <h3>
                {diagnostic.next_action_title ||
                  "Aucune action définie"}
              </h3>

              <p>
                {diagnostic.next_action_description ||
                  "Votre prochaine action sera définie à partir de votre diagnostic."}
              </p>
            </div>
          </div>

          <Link
            type="button"
            to={"/tasks"}
            className="btn btn-primary diagnostic-action-button"
          >
            Travailler ce levier
          </Link>
        </BusinessCard>
      </div>

      {/* =========================================
          AI MODAL
      ========================================= */}

      {showAnalysis && (
        <AIDiagnosticModal
          profile={profile}
          diagnostic={diagnostic}
          onClose={() =>
            setShowAnalysis(false)
          }
        />
      )}
    </div>
  );
}

/*
 * =========================================
 * DIMENSION
 * =========================================
 */

function DiagnosticDimension({
  dimension,
}) {
  return (
    <div className="diagnostic-dimension">
      <div className="diagnostic-dimension-header">
        <div>
          <strong>
            {dimension.name}
          </strong>

          <span
            className={`diagnostic-dimension-status ${mapDimensionStatus(
              dimension.status
            )}`}
          >
            {getStatusLabel(
              dimension.status
            )}
          </span>
        </div>

        <strong className="diagnostic-dimension-score">
          {dimension.score}

          <small>/100</small>
        </strong>
      </div>

      <div className="diagnostic-dimension-progress">
        <div
          style={{
            width: `${dimension.score}%`,
          }}
        />
      </div>

      <p>
        {dimension.description}
      </p>
    </div>
  );
}

/*
 * =========================================
 * RECOMMENDATION
 * =========================================
 */

function Recommendation({
  recommendation,
  index,
}) {
  return (
    <div className="diagnostic-recommendation">
      <div className="diagnostic-recommendation-number">
        {index}
      </div>

      <div className="diagnostic-recommendation-content">
        <div className="diagnostic-recommendation-header">
          <h3>
            {recommendation.title}
          </h3>

          <span
            className={`recommendation-priority ${recommendation.priority}`}
          >
            {getRecommendationPriorityLabel(
              recommendation.priority
            )}
          </span>
        </div>

        <p>
          {recommendation.description}
        </p>

        <small>
          Impact :{" "}
          <strong>
            {getImpactLabel(
              recommendation.impact
            )}
          </strong>
        </small>
      </div>
    </div>
  );
}

/*
 * =========================================
 * HELPERS
 * =========================================
 */

function mapDimensionStatus(status) {
  switch (status) {
    case "solide":
      return "strong";

    case "a_optimiser":
      return "medium";

    case "prioritaire":
      return "weak";

    case "critique":
      return "weak";

    default:
      return "";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "solide":
      return "Solide";

    case "a_optimiser":
      return "À optimiser";

    case "prioritaire":
      return "Prioritaire";

    case "critique":
      return "Critique";

    default:
      return "";
  }
}

function getRecommendationPriorityLabel(
  priority
) {
  switch (priority) {
    case "priority":
      return "Prioritaire";

    case "work_on":
      return "À travailler";

    case "optional":
      return "Optionnel";

    default:
      return "";
  }
}

function getImpactLabel(impact) {
  switch (impact) {
    case "high":
      return "Fort";

    case "medium":
      return "Moyen";

    case "low":
      return "Faible";

    default:
      return impact || "";
  }
}

function getBusinessScoreLabel(score) {
  if (score >= 85) {
    return "Excellent niveau de maturité";
  }

  if (score >= 70) {
    return "Bon niveau de maturité";
  }

  if (score >= 50) {
    return "Niveau de maturité à renforcer";
  }

  return "Niveau de maturité prioritaire";
}

function formatDiagnosticDate(date) {
  try {
    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ).format(new Date(date));
  } catch {
    return "date inconnue";
  }
}

export default BusinessDiagnostics;