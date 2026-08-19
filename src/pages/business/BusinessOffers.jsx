import { useMemo, useState } from "react";

import BusinessCard from "../../components/business/BusinessCard";
import ConfirmModal from "../../components/business/ConfirmModal";
import OfferFormModal from "../../components/business/OfferFormModal";

function BusinessOffers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "Growth Sprint",
      type: "Accompagnement",
      description:
        "Accompagnement intensif de 6 semaines pour structurer l'acquisition et construire un système commercial.",
      price: 15000,
      priceType: "one_time",
      duration: "6 semaines",
      status: "active",
      featured: true,
      clients: 8,
    },
    {
      id: 2,
      name: "Growth Partner",
      type: "Accompagnement",
      description:
        "Accompagnement stratégique mensuel avec suivi continu, CRM et reporting.",
      price: 8000,
      priceType: "monthly",
      duration: "Mensuel",
      status: "active",
      featured: false,
      clients: 5,
    },
    {
      id: 3,
      name: "Diagnostic Stratégique",
      type: "Conseil",
      description:
        "Audit complet du positionnement, de l'offre et du système commercial.",
      price: 3000,
      priceType: "one_time",
      duration: "1 session",
      status: "draft",
      featured: false,
      clients: 0,
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [offerModal, setOfferModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        offer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        offer.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        offer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [offers, search, statusFilter]);

  const activeOffers = offers.filter(
    (offer) => offer.status === "active"
  ).length;

  const draftOffers = offers.filter(
    (offer) => offer.status === "draft"
  ).length;

  const totalClients = offers.reduce(
    (total, offer) => total + (offer.clients || 0),
    0
  );

  const handleSaveOffer = (offer) => {
    setOffers((currentOffers) => {
      if (offer.id) {
        return currentOffers.map((currentOffer) =>
          currentOffer.id === offer.id
            ? {
                ...currentOffer,
                ...offer,
              }
            : currentOffer
        );
      }

      const nextId =
        currentOffers.length > 0
          ? Math.max(
              ...currentOffers.map((item) => item.id)
            ) + 1
          : 1;

      return [
        ...currentOffers,
        {
          ...offer,
          id: nextId,
          clients: 0,
        },
      ];
    });

    setOfferModal(null);
  };

  const handleDeleteOffer = () => {
    if (!deleteTarget) return;

    setOffers((currentOffers) =>
      currentOffers.filter(
        (offer) => offer.id !== deleteTarget.id
      )
    );

    setDeleteTarget(null);
  };

  const toggleOfferStatus = (offer) => {
    setOffers((currentOffers) =>
      currentOffers.map((currentOffer) =>
        currentOffer.id === offer.id
          ? {
              ...currentOffer,
              status:
                currentOffer.status === "active"
                  ? "draft"
                  : "active",
            }
          : currentOffer
      )
    );
  };

  return (
    <div className="business-offers-page">

      {/* Header */}
      <div className="business-page-header">

        <div>
          <span className="business-page-eyebrow">
            BUSINESS / OFFRES
          </span>

          <h1>Offres</h1>

          <p>
            Structurez les produits et services que
            vous proposez à vos clients.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOfferModal("new")}
        >
          + Nouvelle offre
        </button>

      </div>

      {/* KPIs */}
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

      {/* Main */}
      <BusinessCard
        title="Catalogue d'offres"
        subtitle="Gérez les offres qui composent votre activité."
      >

        {/* Filters */}
        <div className="offers-toolbar">

          <div className="offers-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
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

        {/* Offers */}
        {filteredOffers.length > 0 ? (
          <div className="offers-list">

            {filteredOffers.map((offer) => (
              <OfferRow
                key={offer.id}
                offer={offer}
                onEdit={() =>
                  setOfferModal(offer)
                }
                onDelete={() =>
                  setDeleteTarget(offer)
                }
                onToggleStatus={() =>
                  toggleOfferStatus(offer)
                }
              />
            ))}

          </div>
        ) : (
          <EmptyOffers
            onAdd={() =>
              setOfferModal("new")
            }
          />
        )}

      </BusinessCard>

      {/* Modal création / édition */}
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

      {/* Confirmation suppression */}
      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${deleteTarget.name}" ? Cette action est irréversible.`}
          onCancel={() =>
            setDeleteTarget(null)
          }
          onConfirm={handleDeleteOffer}
        />
      )}

    </div>
  );
}

/* =========================================
   STAT
========================================= */

function OfferStat({
  label,
  value,
  description,
}) {
  return (
    <div className="offer-stat-card">

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{description}</small>

    </div>
  );
}

/* =========================================
   OFFER ROW
========================================= */

function OfferRow({
  offer,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <div className="offer-row">

      <div className="offer-row-main">

        <div className="offer-icon">
          {offer.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="offer-info">

          <div className="offer-title">

            <h3>{offer.name}</h3>

            {offer.featured && (
              <span className="offer-featured">
                ⭐ Offre principale
              </span>
            )}

          </div>

          <span className="offer-type">
            {offer.type}
          </span>

          <p>{offer.description}</p>

        </div>

      </div>

      <div className="offer-row-price">

        <strong>
          {formatPrice(offer.price)}
        </strong>

        <span>
          {formatPriceType(
            offer.priceType
          )}
        </span>

      </div>

      <div className="offer-row-duration">
        <span>Durée</span>
        <strong>{offer.duration}</strong>
      </div>

      <div className="offer-row-clients">
        <span>Clients</span>
        <strong>{offer.clients || 0}</strong>
      </div>

      <div className="offer-row-status">

        <button
          type="button"
          className={`offer-status ${
            offer.status
          }`}
          onClick={onToggleStatus}
        >
          <span />
          {offer.status === "active"
            ? "Active"
            : "Brouillon"}
        </button>

      </div>

      <div className="offer-row-actions">

        <button
          type="button"
          title="Modifier"
          onClick={onEdit}
        >
          ✎
        </button>

        <button
          type="button"
          title="Supprimer"
          onClick={onDelete}
        >
          ×
        </button>

      </div>

    </div>
  );
}

/* =========================================
   EMPTY STATE
========================================= */

function EmptyOffers({ onAdd }) {
  return (
    <div className="offers-empty">

      <div className="offers-empty-icon">
        +
      </div>

      <h3>Aucune offre trouvée</h3>

      <p>
        Créez votre première offre pour
        commencer à structurer votre catalogue.
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

/* =========================================
   HELPERS
========================================= */

function formatPrice(price) {
  if (price === null || price === undefined) {
    return "Prix non défini";
  }

  return `${Number(price).toLocaleString(
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
      return "paiement unique";

    default:
      return "";
  }
}

export default BusinessOffers;