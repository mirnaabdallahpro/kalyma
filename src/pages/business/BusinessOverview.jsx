import { useState } from "react";

import BusinessAIDiagnostic from "../../components/business/BusinessAIDiagnostic";
import GoalsPanel from "../../components/business/GoalsPanel";
import OffersPanel from "../../components/business/OffersPanel";
import ProfileOverviewPanel from "../../components/business/ProfileOverviewPanel";

import AIDiagnosticModal from "../../components/business/AIDiagnosticModal";
import ConfirmModal from "../../components/business/ConfirmModal";
import EditProfileModal from "../../components/business/EditProfileModal";
import GoalFormModal from "../../components/business/GoalFormModal";
import OfferFormModal from "../../components/business/OfferFormModal";

function BusinessOverview() {
  /* =========================================
     BUSINESS PROFILE
  ========================================= */

  const [profile, setProfile] = useState({
    companyName: "Kalyma",
    sector: "Conseil & Growth",

    positioning: "Clair",

    icp: "PME B2B",

    description:
      "Entreprise spécialisée dans l'accompagnement stratégique et la croissance des entreprises.",

    valueProposition:
      "Nous aidons les entreprises à transformer leur stratégie commerciale en système de croissance mesurable, grâce au conseil, au marketing et à la technologie.",

    valuePropositionScore: 82,

    completion: 82,
  });

  /* =========================================
     OFFERS
  ========================================= */

  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "Growth Sprint",
      price: 15000,
      priceType: "one_time",
      status: "active",

      description:
        "Accompagnement intensif de 6 semaines pour structurer l'acquisition.",
    },

    {
      id: 2,
      name: "Growth Partner",
      price: 8000,
      priceType: "monthly",
      status: "active",

      description:
        "Abonnement mensuel avec suivi continu, CRM et reporting.",
    },

    {
      id: 3,
      name: "Diagnostic Stratégique",
      price: 3000,
      priceType: "one_time",
      status: "draft",

      description:
        "Audit complet du positionnement et du système commercial.",
    },
  ]);

  /* =========================================
     GOALS
  ========================================= */

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Atteindre 50 000 MAD / mois",
      target: 50000,
      current: 31000,
      deadline: "décembre",
      color: "secondary",
    },

    {
      id: 2,
      title: "100 prospects qualifiés",
      target: 100,
      current: 64,
      deadline: "",
      color: "accent",
    },

    {
      id: 3,
      title: "Structurer l'offre Growth",
      target: null,
      current: null,
      statusLabel: "En cours",
      color: "primary",
    },
  ]);

  /* =========================================
     UI STATE
  ========================================= */

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [offerModal, setOfferModal] =
    useState(null);

  const [goalModal, setGoalModal] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [showDiagnostic, setShowDiagnostic] =
    useState(false);

  /* =========================================
     PROFILE
  ========================================= */

  const handleSaveProfile = (form) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      ...form,
    }));

    setEditingProfile(false);
  };

  /* =========================================
     OFFERS
  ========================================= */

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
              ...currentOffers.map(
                (item) => item.id
              )
            ) + 1
          : 1;

      return [
        ...currentOffers,
        {
          ...offer,
          id: nextId,
        },
      ];
    });

    setOfferModal(null);
  };

  /* =========================================
     GOALS
  ========================================= */

  const handleSaveGoal = (goal) => {
    setGoals((currentGoals) => {
      if (goal.id) {
        return currentGoals.map((currentGoal) =>
          currentGoal.id === goal.id
            ? {
                ...currentGoal,
                ...goal,
              }
            : currentGoal
        );
      }

      const nextId =
        currentGoals.length > 0
          ? Math.max(
              ...currentGoals.map(
                (item) => item.id
              )
            ) + 1
          : 1;

      return [
        ...currentGoals,
        {
          ...goal,
          id: nextId,
        },
      ];
    });

    setGoalModal(null);
  };

  /* =========================================
     DELETE
  ========================================= */

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "offer") {
      setOffers((currentOffers) =>
        currentOffers.filter(
          (offer) =>
            offer.id !== deleteTarget.item.id
        )
      );
    }

    if (deleteTarget.type === "goal") {
      setGoals((currentGoals) =>
        currentGoals.filter(
          (goal) =>
            goal.id !== deleteTarget.item.id
        )
      );
    }

    setDeleteTarget(null);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="business-overview">

      {/* HEADER */}

      <div className="business-page-header">

        <div>
          <span className="business-page-eyebrow">
            BUSINESS
          </span>

          <h1>Vue d'ensemble</h1>

          <p>
            Le cockpit stratégique de votre
            entreprise.
          </p>
        </div>

        <div className="business-page-date">
          Dernière mise à jour : aujourd'hui
        </div>

      </div>

      {/* PROFILE + GOALS */}

      <div className="grid-main">

        <ProfileOverviewPanel
          profile={{
            ...profile,

            completion:
              profile.completion,

            offersCount:
              offers.length,
          }}
          onEdit={() =>
            setEditingProfile(true)
          }
        />

        <div>

          <GoalsPanel
            goals={goals}
            onAdd={() =>
              setGoalModal("new")
            }
            onEdit={(goal) =>
              setGoalModal(goal)
            }
            onDelete={(goal) =>
              setDeleteTarget({
                type: "goal",
                item: goal,
              })
            }
          />

          <BusinessAIDiagnostic
            insight={
              "Votre proposition de valeur est claire. Le prochain levier à travailler est la preuve sociale et la différenciation de vos offres."
            }
            onSeeAnalysis={() =>
              setShowDiagnostic(true)
            }
          />

        </div>

      </div>

      {/* OFFERS */}

      <div style={{ marginTop: 18 }}>

        <OffersPanel
          offers={offers}
          onAdd={() =>
            setOfferModal("new")
          }
          onEdit={(offer) =>
            setOfferModal(offer)
          }
          onDelete={(offer) =>
            setDeleteTarget({
              type: "offer",
              item: offer,
            })
          }
        />

      </div>

      {/* PROFILE MODAL */}

      {editingProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() =>
            setEditingProfile(false)
          }
          onSave={handleSaveProfile}
        />
      )}

      {/* OFFER MODAL */}

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

      {/* GOAL MODAL */}

      {goalModal && (
        <GoalFormModal
          initialGoal={
            goalModal === "new"
              ? null
              : goalModal
          }
          onClose={() =>
            setGoalModal(null)
          }
          onSave={handleSaveGoal}
        />
      )}

      {/* DELETE MODAL */}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${
            deleteTarget.item.title ||
            deleteTarget.item.name
          }" ? Cette action est irréversible.`}
          onCancel={() =>
            setDeleteTarget(null)
          }
          onConfirm={confirmDelete}
        />
      )}

      {/* AI DIAGNOSTIC */}

      {showDiagnostic && (
        <AIDiagnosticModal
          profile={{
            ...profile,
            offersCount: offers.length,
          }}
          onClose={() =>
            setShowDiagnostic(false)
          }
        />
      )}

    </div>
  );
}

export default BusinessOverview;