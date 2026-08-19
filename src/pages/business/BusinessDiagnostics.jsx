import { useMemo, useState } from "react";

import AIDiagnosticModal from "../../components/business/AIDiagnosticModal";
import BusinessCard from "../../components/business/BusinessCard";

function BusinessDiagnostics() {
  const [showAnalysis, setShowAnalysis] = useState(false);

  /*
   * V1 : données mockées.
   *
   * Plus tard, ces données viendront de l'API :
   * GET /api/business/diagnostics/latest
   */

  const profile = {
    companyName: "Kalyma",
    sector: "Conseil & Growth",
    positioning: "Clair",
    icp: "PME B2B",

    valueProposition:
      "Nous aidons les entreprises à transformer leur stratégie commerciale en système de croissance mesurable, grâce au conseil, au marketing et à la technologie.",

    valuePropositionScore: 82,
  };

  const diagnostic = {
    overallScore: 78,

    status: "good",

    summary:
      "Votre entreprise dispose de fondations solides. Le positionnement et la proposition de valeur sont relativement clairs, mais le système commercial et la différenciation de l'offre peuvent encore être renforcés.",

    dimensions: [
      {
        key: "positioning",
        label: "Positionnement",
        score: 86,
        status: "strong",
        description:
          "Votre positionnement est clair et compréhensible par votre marché.",
      },

      {
        key: "icp",
        label: "Client idéal",
        score: 81,
        status: "strong",
        description:
          "Votre cible est définie, mais peut encore être davantage segmentée.",
      },

      {
        key: "value",
        label: "Proposition de valeur",
        score: 82,
        status: "strong",
        description:
          "La promesse est claire, mais la différenciation mérite d'être renforcée.",
      },

      {
        key: "offers",
        label: "Offres",
        score: 74,
        status: "medium",
        description:
          "Les offres sont structurées mais leur architecture pourrait être simplifiée.",
      },

      {
        key: "acquisition",
        label: "Acquisition",
        score: 67,
        status: "medium",
        description:
          "Le système d'acquisition représente actuellement votre principal levier de progression.",
      },

      {
        key: "commercial",
        label: "Système commercial",
        score: 69,
        status: "medium",
        description:
          "Le processus commercial doit être davantage structuré et mesuré.",
      },
    ],

    recommendations: [
      {
        priority: "high",
        title:
          "Renforcer la différenciation de votre offre principale",
        description:
          "Clarifiez pourquoi votre solution est différente des alternatives disponibles sur votre marché.",
        impact: "Fort",
      },

      {
        priority: "high",
        title:
          "Structurer votre système d'acquisition",
        description:
          "Définissez un canal principal, une mécanique de génération de prospects et des indicateurs de suivi.",
        impact: "Fort",
      },

      {
        priority: "medium",
        title:
          "Formaliser votre processus commercial",
        description:
          "Documentez les différentes étapes entre le premier contact et la conversion.",
        impact: "Moyen",
      },
    ],

    nextAction: {
      title:
        "Travailler le système d'acquisition",
      description:
        "C'est actuellement le levier présentant le plus fort potentiel d'amélioration.",
    },
  };

  const strongestDimension = useMemo(() => {
    return [...diagnostic.dimensions].sort(
      (a, b) => b.score - a.score
    )[0];
  }, [diagnostic.dimensions]);

  const weakestDimension = useMemo(() => {
    return [...diagnostic.dimensions].sort(
      (a, b) => a.score - b.score
    )[0];
  }, [diagnostic.dimensions]);

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

          <h1>Diagnostic stratégique</h1>

          <p>
            Analysez la maturité actuelle de votre
            entreprise et identifiez vos prochains
            leviers de croissance.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            setShowAnalysis(true)
          }
        >
          ✦ Analyse Kalyma AI
        </button>

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
            {diagnostic.overallScore}
            <span>/100</span>
          </div>

          <div className="diagnostic-score-status">
            <span className="diagnostic-status-dot" />

            Bon niveau de maturité
          </div>

          <div className="diagnostic-score-progress">

            <div
              style={{
                width: `${diagnostic.overallScore}%`,
              }}
            />

          </div>

          <p>
            Dernier diagnostic : aujourd'hui
          </p>

        </div>

        <div className="diagnostic-summary-card">

          <span className="diagnostic-section-label">
            SYNTHÈSE
          </span>

          <h2>
            Votre entreprise possède de bonnes
            fondations.
          </h2>

          <p>
            {diagnostic.summary}
          </p>

          <div className="diagnostic-highlights">

            <div>
              <span>Point fort</span>

              <strong>
                {strongestDimension.label}
              </strong>

              <small>
                {strongestDimension.score}/100
              </small>
            </div>

            <div>
              <span>Priorité</span>

              <strong>
                {weakestDimension.label}
              </strong>

              <small>
                {weakestDimension.score}/100
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

          {diagnostic.dimensions.map(
            (dimension) => (
              <DiagnosticDimension
                key={dimension.key}
                dimension={dimension}
              />
            )
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

            {diagnostic.recommendations.map(
              (recommendation, index) => (
                <Recommendation
                  key={index}
                  recommendation={recommendation}
                  index={index + 1}
                />
              )
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
                {diagnostic.nextAction.title}
              </h3>

              <p>
                {diagnostic.nextAction.description}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="btn btn-primary diagnostic-action-button"
          >
            Travailler ce levier
          </button>

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

/* =========================================
   DIMENSION
========================================= */

function DiagnosticDimension({
  dimension,
}) {
  return (
    <div className="diagnostic-dimension">

      <div className="diagnostic-dimension-header">

        <div>

          <strong>
            {dimension.label}
          </strong>

          <span
            className={`diagnostic-dimension-status ${dimension.status}`}
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

/* =========================================
   RECOMMENDATION
========================================= */

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
            {recommendation.priority ===
            "high"
              ? "Prioritaire"
              : "À travailler"}
          </span>

        </div>

        <p>
          {recommendation.description}
        </p>

        <small>
          Impact :{" "}
          <strong>
            {recommendation.impact}
          </strong>
        </small>

      </div>

    </div>
  );
}

/* =========================================
   HELPERS
========================================= */

function getStatusLabel(status) {
  switch (status) {
    case "strong":
      return "Solide";

    case "medium":
      return "À optimiser";

    case "weak":
      return "Prioritaire";

    default:
      return "";
  }
}

export default BusinessDiagnostics;