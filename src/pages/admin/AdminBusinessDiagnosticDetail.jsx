import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getAdminBusinessDiagnosticDetail,
} from "../../../services/admin/adminBusinessDiagnosticService";

import "../../styles/biusiness-diagnostic.css";



function AdminBusinessDiagnosticDetail() {
  const {
    clientId,
    diagnosticId,
  } = useParams();

  const navigate = useNavigate();

  const [diagnostic, setDiagnostic] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {
    if (diagnosticId) {
      loadDiagnostic();
    }
  }, [diagnosticId]);


  async function loadDiagnostic() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getAdminBusinessDiagnosticDetail(
          diagnosticId
        );

      setDiagnostic(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Impossible de charger le diagnostic."
      );
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="admin-business-page">
        Chargement du diagnostic...
      </div>
    );
  }


  if (error) {
    return (
      <div className="admin-business-page">

        <p>{error}</p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate(
              `/admin/business/${clientId}`
            )
          }
        >
          Retour au client
        </button>

      </div>
    );
  }


  if (!diagnostic) {
    return (
      <div className="admin-business-page">
        <p>
          Diagnostic introuvable.
        </p>
      </div>
    );
  }


  const dimensions =
    diagnostic.business_diagnostic_dimensions ??
    diagnostic.dimensions ??
    [];

  const recommendations =
    diagnostic.business_diagnostic_recommendations ??
    diagnostic.recommendations ??
    [];


  return (
    <div className="admin-business-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-page-header">

        <div>

          <button
            type="button"
            className="admin-business-back"
            onClick={() =>
              navigate(
                `/admin/business/${clientId}`
              )
            }
          >
            ← Retour au client
          </button>

          <span className="admin-page-eyebrow">
            ADMIN / BUSINESS / DIAGNOSTIC
          </span>

          <h1>
            Diagnostic stratégique
          </h1>

          <p>
            Version{" "}
            {diagnostic.version}
          </p>

        </div>

        <div className="admin-diagnostic-header-actions">

          {diagnostic.is_current && (
            <span className="admin-diagnostic-current">
              Diagnostic actuel
            </span>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/admin/business/${clientId}/diagnostic`
              )
            }
          >
            Générer nouveau diagnostic
          </button>

        </div>

      </div>


      {/* =========================================
          SCORE
      ========================================= */}

      <section className="admin-diagnostic-result-score">

        <div>

          <span className="admin-section-label">
            SCORE BUSINESS
          </span>

          <div className="admin-diagnostic-result-number">
            {diagnostic.business_score}
            <small>/100</small>
          </div>

          <div className="admin-diagnostic-result-progress">

            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    diagnostic.business_score ??
                      0
                  )
                )}%`,
              }}
            />

          </div>

        </div>

        <div className="admin-diagnostic-result-meta">

          <span>
            Version{" "}
            {diagnostic.version}
          </span>

          <span>
            {formatDate(
              diagnostic.generated_at ||
                diagnostic.created_at
            )}
          </span>

          <span>
            Source :{" "}
            {getSourceLabel(
              diagnostic.source
            )}
          </span>

        </div>

      </section>


      {/* =========================================
          SYNTHÈSE
      ========================================= */}

      <AdminResultSection
        title="Synthèse"
        subtitle="Lecture stratégique du diagnostic."
      >

        <div className="admin-diagnostic-synthesis">

          <h2>
            {diagnostic.synthesis_title ||
              "Synthèse"}
          </h2>

          <p>
            {diagnostic.synthesis_description ||
              "Aucune synthèse disponible."}
          </p>

        </div>

      </AdminResultSection>


      {/* =========================================
          HIGHLIGHTS
      ========================================= */}

      <AdminResultSection
        title="Points clés"
        subtitle="Forces et leviers prioritaires."
      >

        <div className="admin-diagnostic-highlights">

          <div className="admin-diagnostic-highlight">

            <span>
              POINT FORT
            </span>

            <strong>
              {diagnostic.strength_dimension ||
                "Non renseigné"}
            </strong>

            {diagnostic.strength_score !==
              null &&
              diagnostic.strength_score !==
                undefined && (
                <small>
                  {diagnostic.strength_score}
                  /100
                </small>
              )}

          </div>


          <div className="admin-diagnostic-highlight">

            <span>
              PRIORITÉ
            </span>

            <strong>
              {diagnostic.priority_dimension ||
                "Non renseigné"}
            </strong>

            {diagnostic.priority_score !==
              null &&
              diagnostic.priority_score !==
                undefined && (
                <small>
                  {diagnostic.priority_score}
                  /100
                </small>
              )}

          </div>

        </div>

      </AdminResultSection>


      {/* =========================================
          DIMENSIONS
      ========================================= */}

      <AdminResultSection
        title="Analyse des dimensions"
        subtitle="Évaluation des principaux fondamentaux du business."
      >

        {dimensions.length === 0 ? (
          <EmptyResult
            text="Aucune dimension enregistrée."
          />
        ) : (
          <div className="admin-diagnostic-result-dimensions">

            {dimensions.map(
              (dimension) => (
                <DiagnosticDimension
                  key={
                    dimension.id ??
                    dimension.key
                  }
                  dimension={
                    dimension
                  }
                />
              )
            )}

          </div>
        )}

      </AdminResultSection>


      {/* =========================================
          RECOMMANDATIONS
      ========================================= */}

      <AdminResultSection
        title="Recommandations"
        subtitle="Actions prioritaires identifiées."
      >

        {recommendations.length === 0 ? (
          <EmptyResult
            text="Aucune recommandation enregistrée."
          />
        ) : (
          <div className="admin-diagnostic-result-recommendations">

            {recommendations.map(
              (
                recommendation,
                index
              ) => (
                <Recommendation
                  key={
                    recommendation.id ??
                    index
                  }
                  recommendation={
                    recommendation
                  }
                  index={
                    index + 1
                  }
                />
              )
            )}

          </div>
        )}

      </AdminResultSection>


      {/* =========================================
          NEXT ACTION
      ========================================= */}

      <AdminResultSection
        title="Prochaine action"
        subtitle="Le prochain levier à travailler."
      >

        <div className="admin-diagnostic-next-action">

          <div className="admin-diagnostic-next-icon">
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
                ""}
            </p>

          </div>

        </div>

      </AdminResultSection>


      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="admin-diagnostic-footer">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate(
              `/admin/business/${clientId}`
            )
          }
        >
          Retour au client
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              `/admin/business/${clientId}/diagnostic`
            )
          }
        >
          Générer une nouvelle version
        </button>

      </div>

    </div>
  );
}


/* =========================================
   RESULT SECTION
========================================= */

function AdminResultSection({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="admin-diagnostic-result-section">

      <div className="admin-diagnostic-result-section-header">

        <div>

          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}

        </div>

      </div>

      <div className="admin-diagnostic-result-section-body">
        {children}
      </div>

    </section>
  );
}


/* =========================================
   DIMENSION
========================================= */

function DiagnosticDimension({
  dimension,
}) {
  const score =
    Number(dimension.score) || 0;

  return (
    <div className="admin-diagnostic-result-dimension">

      <div className="admin-diagnostic-result-dimension-header">

        <div>

          <strong>
            {dimension.label ||
              dimension.name ||
              "Dimension"}
          </strong>

          <span
            className={`diagnostic-dimension-status ${
              dimension.status || ""
            }`}
          >
            {getStatusLabel(
              dimension.status
            )}
          </span>

        </div>

        <strong>
          {score}
          <small>/100</small>
        </strong>

      </div>


      <div className="admin-diagnostic-result-dimension-progress">

        <div
          style={{
            width: `${Math.min(
              100,
              Math.max(
                0,
                score
              )
            )}%`,
          }}
        />

      </div>


      <p>
        {dimension.description ||
          ""}
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
    <div className="admin-diagnostic-result-recommendation">

      <div className="admin-diagnostic-recommendation-number">
        {index}
      </div>

      <div className="admin-diagnostic-recommendation-content">

        <div className="admin-diagnostic-recommendation-header">

          <h3>
            {recommendation.title ||
              "Recommandation"}
          </h3>

          <span
            className={`recommendation-priority ${
              recommendation.priority ||
              ""
            }`}
          >
            {getRecommendationPriorityLabel(
              recommendation.priority
            )}
          </span>

        </div>

        <p>
          {recommendation.description ||
            ""}
        </p>

        {recommendation.impact && (
          <small>
            Impact :{" "}
            <strong>
              {recommendation.impact}
            </strong>
          </small>
        )}

      </div>

    </div>
  );
}


/* =========================================
   EMPTY
========================================= */

function EmptyResult({
  text,
}) {
  return (
    <div className="admin-diagnostic-empty-result">
      {text}
    </div>
  );
}


/* =========================================
   HELPERS
========================================= */

function formatDate(date) {
  if (!date) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(date));
}


function getSourceLabel(source) {
  switch (source) {
    case "ai":
      return "Kalyma AI";

    case "admin":
      return "Administrateur";

    case "manual":
      return "Manuel";

    default:
      return source ||
        "Non renseignée";
  }
}


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


function getRecommendationPriorityLabel(
  priority
) {
  switch (priority) {
    case "high":
      return "Prioritaire";

    case "medium":
      return "À travailler";

    case "low":
      return "Faible";

    default:
      return "";
  }
}


export default AdminBusinessDiagnosticDetail;