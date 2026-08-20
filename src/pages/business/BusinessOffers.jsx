import { useEffect, useMemo, useState } from "react";

import BusinessCard from "../../components/business/BusinessCard";
import ConfirmModal from "../../components/business/ConfirmModal";
import OfferFormModal from "../../components/business/OfferFormModal";

import {
  createBusinessOffer,
  deleteBusinessOffer,
  getBusinessOffers,
  updateBusinessOffer,
  updateBusinessOfferStatus,
} from "../../../services/businessOffersService";



function BusinessOffers() {
  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [offerModal, setOfferModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /*
   * ==========================================
   * CHARGEMENT
   * ==========================================
   */

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      setLoading(true);
      setError("");

      const data = await getBusinessOffers();

      setOffers(data || []);
    } catch (err) {
      console.error(
        "Erreur chargement offres :",
        err
      );

      setError(
        "Impossible de charger vos offres."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * FILTRES
   * ==========================================
   */

  const filteredOffers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesSearch =
        !normalizedSearch ||
        offer.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        offer.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        offer.type
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        offer.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    offers,
    search,
    statusFilter,
  ]);

  /*
   * ==========================================
   * STATISTIQUES
   * ==========================================
   */

  const activeOffers = offers.filter(
    (offer) =>
      offer.status === "active"
  ).length;

  const draftOffers = offers.filter(
    (offer) =>
      offer.status === "draft"
  ).length;

  const totalClients = offers.reduce(
    (total, offer) =>
      total + (Number(offer.clients) || 0),
    0
  );

  /*
   * ==========================================
   * CREATION / MODIFICATION
   * ==========================================
   */

  async function handleSaveOffer(offer) {
    try {
      setSaving(true);
      setError("");

      /*
       * Modification
       */
      if (offer.id) {
        const updated =
          await updateBusinessOffer(
            offer.id,
            offer
          );

        setOffers((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      }

      /*
       * Création
       */
      else {
        const created =
          await createBusinessOffer(
            offer
          );

        setOffers((current) => [
          created,
          ...current,
        ]);
      }

      setOfferModal(null);
    } catch (err) {
      console.error(
        "Erreur sauvegarde offre :",
        err
      );

      setError(
        "Impossible d'enregistrer l'offre."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ==========================================
   * SUPPRESSION
   * ==========================================
   */

  async function handleDeleteOffer() {
    if (!deleteTarget) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await deleteBusinessOffer(
        deleteTarget.id
      );

      setOffers((current) =>
        current.filter(
          (offer) =>
            offer.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "Erreur suppression offre :",
        err
      );

      setError(
        "Impossible de supprimer cette offre."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ==========================================
   * CHANGEMENT DE STATUT
   * ==========================================
   */

  async function toggleOfferStatus(
    offer
  ) {
    const newStatus =
      offer.status === "active"
        ? "draft"
        : "active";

    try {
      setError("");

      const updated =
        await updateBusinessOfferStatus(
          offer.id,
          newStatus
        );

      setOffers((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );
    } catch (err) {
      console.error(
        "Erreur changement statut :",
        err
      );

      setError(
        "Impossible de modifier le statut."
      );
    }
  }

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <div className="business-offers-page">

      {/* HEADER */}

      <div className="business-page-header">

        <div>
          <span className="business-page-eyebrow">
            BUSINESS / OFFRES
          </span>

          <h1>
            Offres
          </h1>

          <p>
            Structurez les produits et
            services que vous proposez
            à vos clients.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            setOfferModal("new")
          }
          disabled={saving}
        >
          + Nouvelle offre
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="business-alert business-alert-error">
          {error}
        </div>
      )}

      {/* STATISTIQUES */}

      <div className="offers-stats">

        <OfferStat
          label="Offres actives"
          value={activeOffers}
          description="Actuellement proposées"
        />

        <OfferStat
          label="Brouillons"
          value={draftOffers}
          description="À finaliser"
        />

        <OfferStat
          label="Clients"
          value={totalClients}
          description="Clients accompagnés"
        />

        <OfferStat
          label="Catalogue"
          value={offers.length}
          description="Offres créées"
        />

      </div>

      {/* CATALOGUE */}

      <BusinessCard
        title="Catalogue d'offres"
        subtitle="Gérez les offres qui composent votre activité."
      >

        {loading ? (
          <div className="offers-loading">
            Chargement de vos offres...
          </div>
        ) : (
          <>

            {/* TOOLBAR */}

            <div className="offers-toolbar">

              <div className="offers-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Rechercher une offre..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="offers-filters">

                <button
                  type="button"
                  className={
                    statusFilter === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setStatusFilter("all")
                  }
                >
                  Toutes
                </button>

                <button
                  type="button"
                  className={
                    statusFilter === "active"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setStatusFilter("active")
                  }
                >
                  Actives
                </button>

                <button
                  type="button"
                  className={
                    statusFilter === "draft"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setStatusFilter("draft")
                  }
                >
                  Brouillons
                </button>

              </div>

            </div>

            {/* LISTE */}

            {filteredOffers.length > 0 ? (
              <div className="offers-list">

                {filteredOffers.map(
                  (offer) => (
                    <OfferRow
                      key={offer.id}
                      saving={saving}
                      offer={offer}
                      onEdit={() =>
                        setOfferModal(
                          offer
                        )
                      }
                      onDelete={() =>
                        setDeleteTarget(
                          offer
                        )
                      }
                      onToggleStatus={() =>
                        toggleOfferStatus(
                          offer
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <EmptyOffers
                onAdd={() =>
                  setOfferModal("new")
                }
              />
            )}

          </>
        )}

      </BusinessCard>

      {/* MODALE CREATION / MODIFICATION */}

      {offerModal && (
        <OfferFormModal
          initialOffer={
            offerModal === "new"
              ? null
              : offerModal
          }
          onClose={() =>
            setOfferModal(null)
          }
          onSave={handleSaveOffer}
        />
      )}

      {/* MODALE SUPPRESSION */}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${deleteTarget.name}" ? Cette action est irréversible.`}
          onCancel={() =>
            setDeleteTarget(null)
          }
          onConfirm={
            handleDeleteOffer
          }
        />
      )}

    </div>
  );
}


/*
 * ==========================================
 * STATISTIQUE
 * ==========================================
 */

function OfferStat({
  label,
  value,
  description,
}) {
  return (
    <div className="offer-stat-card">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {description}
      </small>

    </div>
  );
}


/*
 * ==========================================
 * LIGNE OFFRE
 * ==========================================
 */

function OfferRow({
  offer,
  saving,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <div className="offer-row">

      {/* IDENTITE */}

      <div className="offer-row-main">

        <div className="offer-icon">
          {offer.name
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div className="offer-info">

          <div className="offer-title">

            <h3>
              {offer.name}
            </h3>

            {offer.featured && (
              <span className="offer-featured">
                Offre principale
              </span>
            )}

          </div>

          {offer.type && (
            <span className="offer-type">
              {offer.type}
            </span>
          )}

          <p>
            {offer.description ||
              "Aucune description."}
          </p>

        </div>

      </div>

      {/* PRIX */}

      <div className="offer-row-price">

        <strong>
          {formatPrice(
            offer.price
          )}
        </strong>

        <span>
          {formatPriceType(
            offer.priceType ??
              offer.price_type
          )}
        </span>

      </div>

      {/* DUREE */}

      <div className="offer-row-duration">

        <span>
          Durée
        </span>

        <strong>
          {offer.duration ||
            "—"}
        </strong>

      </div>

      {/* CLIENTS */}

      <div className="offer-row-clients">

        <span>
          Clients
        </span>

        <strong>
          {offer.clients || 0}
        </strong>

      </div>

      {/* STATUT */}

      <div className="offer-row-status">

        <button
          type="button"
          className={`offer-status ${offer.status}`}
          onClick={onToggleStatus}
        >

          <span />

          {offer.status === "active"
            ? "Active"
            : "Brouillon"}

        </button>

      </div>

      {/* ACTIONS */}

      <div className="offer-row-actions">

        <button
          type="button"
          title="Modifier"
          onClick={onEdit}
          disabled={saving}
        >
          ✎
        </button>

        <button
          type="button"
          title="Supprimer"
          onClick={onDelete}
          disabled={saving}
        >
          ×
        </button>

      </div>

    </div>
  );
}


/*
 * ==========================================
 * EMPTY STATE
 * ==========================================
 */

function EmptyOffers({
  onAdd,
}) {
  return (
    <div className="offers-empty">

      <div className="offers-empty-icon">
        +
      </div>

      <h3>
        Aucune offre trouvée
      </h3>

      <p>
        Créez votre première offre
        pour commencer à structurer
        votre catalogue.
      </p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={onAdd}
      >
        Créer une offre
      </button>

    </div>
  );
}


/*
 * ==========================================
 * HELPERS
 * ==========================================
 */

function formatPrice(price) {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Prix non défini";
  }

  return `${Number(
    price
  ).toLocaleString(
    "fr-FR"
  )} MAD`;
}


function formatPriceType(type) {
  switch (type) {

    case "monthly":
      return "/ mois";

    case "yearly":
      return "/ an";

    case "one_time":
      return "Paiement unique";

    default:
      return "";

  }
}


export default BusinessOffers;