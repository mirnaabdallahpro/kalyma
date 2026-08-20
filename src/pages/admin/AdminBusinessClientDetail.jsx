import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAdminBusinessClientDetail,
} from "../../../services/admin/adminBusinessService";

function AdminBusinessClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clientId) {
      loadClient();
    }
  }, [clientId]);

  async function loadClient() {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminBusinessClientDetail(clientId);

      console.log("DATA BUSINESS :", data);

      // Le service retourne directement le business_profile
      setBusiness(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Impossible de charger le profil business du client."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-business-page">
        <div className="admin-business-loading">
          Chargement du profil business...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-business-page">
        <div className="admin-business-error">
          <p>{error}</p>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/business")}
          >
            Retour aux clients
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="admin-business-page">
        <p>Profil business introuvable.</p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/business")}
        >
          Retour aux clients
        </button>
      </div>
    );
  }

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
            onClick={() => navigate("/admin/business")}
          >
            ← Retour aux clients
          </button>

          <span className="admin-page-eyebrow">
            ADMIN / BUSINESS / CLIENT
          </span>

          <h1>
            {business.company_name || "Entreprise non renseignée"}
          </h1>

          <p>
            {business.category ||
              business.sector ||
              "Secteur non renseigné"}
          </p>
        </div>

        <div className="admin-business-header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate(
                `/admin/business/${clientId}/diagnostic`
              )
            }
          >
            Voir le diagnostic
          </button>
        </div>
      </div>

      {/* =========================================
          PROFIL BUSINESS
      ========================================= */}

      <AdminSection
        title="Profil Business"
        subtitle="Informations générales de l'entreprise."
      >
        <div className="admin-business-info-grid">

          <InfoItem
            label="Entreprise"
            value={business.company_name}
          />

          <InfoItem
            label="Secteur"
            value={business.sector}
          />

          <InfoItem
            label="Catégorie"
            value={business.category}
          />

          <InfoItem
            label="Stade"
            value={business.stage}
          />

          <InfoItem
            label="Localisation"
            value={business.location}
          />

          <DetailBlock
            label="Marché cible"
            value={business.target_market}
          />

        </div>
      </AdminSection>

      {/* =========================================
          DESCRIPTION
      ========================================= */}

      <AdminSection
        title="Présentation"
        subtitle="Description et identité stratégique de l'entreprise."
      >
        <div className="admin-business-detail-grid">

          <DetailBlock
            label="Description"
            value={business.description}
          />

          <DetailBlock
            label="Vision"
            value={business.vision}
          />

          <DetailBlock
            label="Mission"
            value={business.mission}
          />

          <DetailBlock
            label="Ambition"
            value={business.ambition}
          />

        </div>
      </AdminSection>

      {/* =========================================
          POSITIONNEMENT
      ========================================= */}

      <AdminSection
        title="Positionnement"
        subtitle="Compréhension du positionnement stratégique."
      >
        <div className="admin-business-detail-grid">

          <DetailBlock
            label="Positionnement"
            value={business.positioning}
          />

          <DetailBlock
            label="Différenciation"
            value={business.differentiation}
          />

          <DetailBlock
            label="Problème résolu"
            value={business.problem_solved}
          />

          <DetailBlock
            label="Proposition de valeur"
            value={business.value_proposition}
          />

        </div>
      </AdminSection>

      {/* =========================================
          CLIENT IDÉAL
      ========================================= */}

      <AdminSection
        title="Client idéal"
        subtitle="Informations relatives à l'ICP."
      >
        <div className="admin-business-info-grid">

          <InfoItem
            label="Secteur"
            value={business.icp_sector}
          />

          <InfoItem
            label="Taille"
            value={business.icp_size}
          />

          <InfoItem
            label="CA"
            value={business.icp_revenue}
          />

          <InfoItem
            label="Géographie"
            value={business.icp_geography}
          />

        </div>
      </AdminSection>

      {/* =========================================
          MODÈLE BUSINESS
      ========================================= */}

      <AdminSection
        title="Modèle économique"
        subtitle="Structure actuelle du modèle économique."
      >
        <div className="admin-business-detail-grid">

          <DetailBlock
            label="Business Model"
            value={business.business_model}
          />

          <DetailBlock
            label="Sources de revenus"
            value={
              Array.isArray(business.revenue_sources) &&
              business.revenue_sources.length > 0
                ? business.revenue_sources.join(", ")
                : "Aucune source de revenus renseignée."
            }
          />

        </div>
      </AdminSection>

      {/* =========================================
          DIFFÉRENCIATEURS
      ========================================= */}

      <AdminSection
        title="Différenciateurs"
        subtitle="Éléments permettant à l'entreprise de se distinguer."
      >
        {Array.isArray(business.differentiators) &&
        business.differentiators.length > 0 ? (
          <div className="admin-business-items">
            {business.differentiators.map(
              (differentiator, index) => (
                <div
                  className="admin-business-list-item"
                  key={
                    differentiator.id ||
                    differentiator.key ||
                    index
                  }
                >
                  <div>
                    <h3>
                      {differentiator.title ||
                        differentiator.label ||
                        differentiator.name ||
                        "Différenciateur"}
                    </h3>

                    {differentiator.description && (
                      <p>
                        {differentiator.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <EmptyState
            text="Aucun différenciateur renseigné."
          />
        )}
      </AdminSection>

      {/* =========================================
          SCORE DE VALEUR
      ========================================= */}

      <AdminSection
        title="Évaluation"
        subtitle="Score actuel de la proposition de valeur."
      >
        <div className="admin-business-diagnostic">
          <div className="admin-business-diagnostic-main">

            <span className="admin-section-label">
              VALUE SCORE
            </span>

            <div className="admin-business-diagnostic-score">
              {business.value_score ?? 0}
              <span>/100</span>
            </div>

          </div>
        </div>
      </AdminSection>

      {/* =========================================
          INFORMATIONS TECHNIQUES
      ========================================= */}

      <AdminSection
        title="Informations"
        subtitle="Informations techniques relatives au profil."
      >
        <div className="admin-business-info-grid">

          <InfoItem
            label="ID Business"
            value={business.id}
          />

          <InfoItem
            label="User ID"
            value={business.user_id}
          />

          <InfoItem
            label="Créé le"
            value={formatDate(business.created_at)}
          />

          <InfoItem
            label="Mis à jour le"
            value={formatDate(business.updated_at)}
          />

        </div>
      </AdminSection>

      {/* =========================================
          DIAGNOSTIC
      ========================================= */}

      <AdminSection
        title="Diagnostic"
        subtitle="Diagnostic stratégique du client."
      >
        <div className="admin-business-diagnostic-empty">
          <div>
            <span className="admin-section-label">
              DIAGNOSTIC
            </span>

            <h3>
              Aucun diagnostic chargé
            </h3>

            <p>
              Le profil business est disponible,
              mais les données du diagnostic ne sont
              pas présentes dans la réponse actuelle
              du service.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/admin/business/${clientId}/diagnostic`
              )
            }
          >
            Générer le diagnostic
          </button>
        </div>
      </AdminSection>

    </div>
  );
}


/* =========================================
   SECTION
========================================= */

function AdminSection({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="admin-business-section">

      <div className="admin-business-section-header">
        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>
      </div>

      <div className="admin-business-section-body">
        {children}
      </div>

    </section>
  );
}


/* =========================================
   INFO ITEM
========================================= */

function InfoItem({ label, value }) {
  const [expanded, setExpanded] = useState(false);

  const text = value?.toString().trim() || "Non renseigné";

  // Nombre de caractères avant de proposer "Voir plus"
  const MAX_LENGTH = 90;

  const isLong = text.length > MAX_LENGTH;

  const displayedText =
    !expanded && isLong
      ? `${text.substring(0, MAX_LENGTH)}...`
      : text;

  return (
    <div className="admin-business-info-item">
      <span>{label}</span>

      <strong className={expanded ? "is-expanded" : ""}>
        {displayedText}
      </strong>

      {isLong && (
        <button
          type="button"
          className="admin-business-load-more"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Réduire" : "Voir plus"}
        </button>
      )}
    </div>
  );
}


/* =========================================
   DETAIL BLOCK
========================================= */

function DetailBlock({
  label,
  value,
}) {
  return (
    <div className="admin-business-detail-block">

      <span>{label}</span>

      <p>
        {value || "Non renseigné"}
      </p>

    </div>
  );
}


/* =========================================
   EMPTY
========================================= */

function EmptyState({
  text,
}) {
  return (
    <div className="admin-business-empty">
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


export default AdminBusinessClientDetail;