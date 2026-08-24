import {
  useEffect,
  useMemo,
  useState,
} from "react";

import BusinessAIDiagnostic from "../../components/business/BusinessAIDiagnostic";
import GoalsPanel from "../../components/business/GoalsPanel";
import OffersPanel from "../../components/business/OffersPanel";
import ProfileOverviewPanel from "../../components/business/ProfileOverviewPanel";

import { NavLink } from "react-router-dom";
import AIDiagnosticModal from "../../components/business/AIDiagnosticModal";
import ConfirmModal from "../../components/business/ConfirmModal";
import EditProfileModal from "../../components/business/EditProfileModal";
import GoalFormModal from "../../components/business/GoalFormModal";
import OfferFormModal from "../../components/business/OfferFormModal";
import ComingSoonOverlay from "../../components/shared/ComingSoonOverlay";

import {
  getBusinessProfile,
  updateBusinessProfile,
} from "../../../services/businessProfileService";

import {
  createBusinessOffer,
  deleteBusinessOffer,
  getBusinessOffers,
  updateBusinessOffer,
} from "../../../services/businessOffersService";

import {
  createBusinessGoal,
  deleteBusinessGoal,
  getBusinessGoals,
  updateBusinessGoal,
} from "../../../services/businessGoalService";


function BusinessOverview() {
  /* =========================================
     DATA STATE
  ========================================= */

  const [profile, setProfile] =
    useState(null);

  const [offers, setOffers] =
    useState([]);

  const [goals, setGoals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =========================================
     UI STATE
  ========================================= */

  const [
    editingProfile,
    setEditingProfile,
  ] = useState(false);

  const [
    offerModal,
    setOfferModal,
  ] = useState(null);

  const [
    goalModal,
    setGoalModal,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const [
    showDiagnostic,
    setShowDiagnostic,
  ] = useState(false);


  /* =========================================
     LOAD BUSINESS DATA
  ========================================= */

  useEffect(() => {
    loadOverview();
  }, []);


  async function loadOverview() {
    try {
      setLoading(true);
      setError("");

      const [
        profileData,
        offersData,
        goalsData,
      ] = await Promise.all([
        getBusinessProfile(),
        getBusinessOffers(),
        getBusinessGoals(),
      ]);

      setProfile(profileData);
      setOffers(offersData ?? []);
      setGoals(goalsData ?? []);

    } catch (err) {
      console.error(
        "Erreur chargement BusinessOverview :",
        err
      );

      setError(
        "Impossible de charger les données de votre entreprise."
      );
    } finally {
      setLoading(false);
    }
  }


  /* =========================================
     PROFILE VIEW MODEL
  ========================================= */

  const profileView = useMemo(() => {
    if (!profile) {
      return null;
    }

    return {
      ...profile,

      companyName:
        profile.company_name ?? "",

      sector:
        profile.sector ?? "",

      positioning:
        profile.positioning ?? "",

      description:
        profile.description ?? "",

      valueProposition:
        profile.value_proposition ?? "",

      valuePropositionScore:
        profile.value_score ?? 0,

      icp:
        profile.target_market ?? "",

      completion:
        calculateProfileCompletion(
          profile
        ),

      offersCount:
        offers.length,
    };
  }, [
    profile,
    offers.length,
  ]);


  /* =========================================
     PROFILE
  ========================================= */

  async function handleSaveProfile(form) {
    try {
      setSaving(true);
      setError("");

      const updates =
        normalizeProfileForm(form);

      const updatedProfile =
        await updateBusinessProfile(
          updates
        );

      setProfile(updatedProfile);

      setEditingProfile(false);

    } catch (err) {
      console.error(
        "Erreur sauvegarde profil :",
        err
      );

      setError(
        "Impossible d'enregistrer le profil."
      );
    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     OFFERS
  ========================================= */

  async function handleSaveOffer(offer) {
    try {
      setSaving(true);
      setError("");

      if (offer.id) {
        const updatedOffer =
          await updateBusinessOffer(
            offer.id,
            offer
          );

        setOffers((current) =>
          current.map((item) =>
            item.id === offer.id
              ? updatedOffer
              : item
          )
        );
      } else {
        const newOffer =
          await createBusinessOffer(
            offer
          );

        setOffers((current) => [
          ...current,
          newOffer,
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


  /* =========================================
     GOALS
  ========================================= */

  async function handleSaveGoal(goal) {
    try {
      setSaving(true);
      setError("");

      if (goal.id) {
        const updatedGoal =
          await updateBusinessGoal(
            goal.id,
            goal
          );

        setGoals((current) =>
          current.map((item) =>
            item.id === goal.id
              ? updatedGoal
              : item
          )
        );
      } else {
        const newGoal =
          await createBusinessGoal(
            goal
          );

        setGoals((current) => [
          ...current,
          newGoal,
        ]);
      }

      setGoalModal(null);

    } catch (err) {
      console.error(
        "Erreur sauvegarde objectif :",
        err
      );

      setError(
        "Impossible d'enregistrer l'objectif."
      );
    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     DELETE
  ========================================= */

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const {
        type,
        item,
      } = deleteTarget;

      if (type === "offer") {
        await deleteBusinessOffer(
          item.id
        );

        setOffers((current) =>
          current.filter(
            (offer) =>
              offer.id !== item.id
          )
        );
      }

      if (type === "goal") {
        await deleteBusinessGoal(
          item.id
        );

        setGoals((current) =>
          current.filter(
            (goal) =>
              goal.id !== item.id
          )
        );
      }

      setDeleteTarget(null);

    } catch (err) {
      console.error(
        "Erreur suppression :",
        err
      );

      setError(
        "Impossible de supprimer cet élément."
      );
    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     AI INSIGHT
  ========================================= */

  const aiInsight = useMemo(() => {
    if (!profile) {
      return "";
    }

    return generateBusinessInsight(
      profile,
      offers,
      goals
    );
  }, [
    profile,
    offers,
    goals,
  ]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="business-overview">

        <div className="business-page-header">

          <div>
            <span className="business-page-eyebrow">
              BUSINESS
            </span>

            <h1>
              Vue d'ensemble
            </h1>

            <p>
              Chargement de votre cockpit
              stratégique...
            </p>
          </div>

        </div>

        <div className="business-loading">
          Chargement...
        </div>

      </div>
    );
  }


  /* =========================================
     NO PROFILE
  ========================================= */

  if (!profile) {
    return (
      <div className="business-overview">

        <div className="business-page-header">

          <div>

            <span className="business-page-eyebrow">
              BUSINESS
            </span>

            <h1>
              Vue d'ensemble
            </h1>

            <p>
              Votre entreprise n'est pas
              encore configurée.
            </p>

          </div>

        </div>

        <div className="business-alert">
          Commencez par créer votre
          profil business.

          
        </div>
        <div style={{marginTop:"0.7rem"}}>
          <NavLink to={"/business/profile"} className="btn btn-primary">Configurer mon profil business</NavLink>
        </div>

      </div>
    );
  }


  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="business-overview">

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="business-alert business-alert-error">
          {error}
        </div>
      )}


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="business-page-header">

        <div>

          <span className="business-page-eyebrow">
            BUSINESS
          </span>

          <h1>
            Vue d'ensemble
          </h1>

          <p>
            Le cockpit stratégique de votre
            entreprise.
          </p>

        </div>

        <div className="business-page-date">
          Dernière mise à jour :{" "}
          {formatLastUpdate(
            profile.updated_at
          )}
        </div>

      </div>


      {/* =====================================
          PROFILE + GOALS
      ===================================== */}

      <div className="grid-main">

        <ProfileOverviewPanel
          profile={profileView}
          onEdit={() =>
            setEditingProfile(true)
          }
        />

        <div>
          <ComingSoonOverlay>

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
          </ComingSoonOverlay>

          <BusinessAIDiagnostic
            insight={aiInsight}
            onSeeAnalysis={() =>
              setShowDiagnostic(true)
            }
          />

        </div>

      </div>


      {/* =====================================
          OFFERS
      ===================================== */}

      <div
        style={{
          marginTop: 18,
        }}
      >

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


      {/* =====================================
          PROFILE MODAL
      ===================================== */}

      {editingProfile && (
        <EditProfileModal
          profile={profileView}
          onClose={() =>
            setEditingProfile(false)
          }
          onSave={handleSaveProfile}
        />
      )}


      {/* =====================================
          OFFER MODAL
      ===================================== */}

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


      {/* =====================================
          GOAL MODAL
      ===================================== */}

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


      {/* =====================================
          DELETE MODAL
      ===================================== */}

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


      {/* =====================================
          AI DIAGNOSTIC
      ===================================== */}

      {showDiagnostic && (
        <AIDiagnosticModal
          profile={{
            ...profileView,

            offersCount:
              offers.length,

            goalsCount:
              goals.length,

            activeOffersCount:
              offers.filter(
                (offer) =>
                  offer.status ===
                  "active"
              ).length,

            completedGoalsCount:
              goals.filter(
                (goal) =>
                  goal.status ===
                  "done"
              ).length,

            offers,
            goals,
          }}
          onClose={() =>
            setShowDiagnostic(false)
          }
        />
      )}

    </div>
  );
}


/* =========================================
   PROFILE FORM NORMALIZATION
========================================= */

function normalizeProfileForm(form) {
  const updates = {};

  if (
    form.companyName !== undefined
  ) {
    updates.companyName =
      form.companyName;
  }

  if (
    form.sector !== undefined
  ) {
    updates.sector =
      form.sector;
  }

  if (
    form.location !== undefined
  ) {
    updates.location =
      form.location;
  }

  if (
    form.stage !== undefined
  ) {
    updates.stage =
      form.stage;
  }

  if (
    form.description !== undefined
  ) {
    updates.description =
      form.description;
  }

  if (
    form.vision !== undefined
  ) {
    updates.vision =
      form.vision;
  }

  if (
    form.mission !== undefined
  ) {
    updates.mission =
      form.mission;
  }

  if (
    form.ambition !== undefined
  ) {
    updates.ambition =
      form.ambition;
  }

  if (
    form.positioning !== undefined
  ) {
    updates.positioning =
      form.positioning;
  }

  if (
    form.category !== undefined
  ) {
    updates.category =
      form.category;
  }

  if (
    form.problemSolved !== undefined
  ) {
    updates.problemSolved =
      form.problemSolved;
  }

  if (
    form.differentiation !== undefined
  ) {
    updates.differentiation =
      form.differentiation;
  }

  if (
    form.valueProposition !== undefined
  ) {
    updates.valueProposition =
      form.valueProposition;
  }

  if (
    form.businessModel !== undefined
  ) {
    updates.businessModel =
      form.businessModel;
  }

  if (
    form.revenueSources !== undefined
  ) {
    updates.revenueSources =
      form.revenueSources;
  }

  if (
    form.targetMarket !== undefined
  ) {
    updates.targetMarket =
      form.targetMarket;
  }

  return updates;
}


/* =========================================
   PROFILE COMPLETION
========================================= */

function calculateProfileCompletion(
  profile
) {
  const fields = [
    profile.company_name,
    profile.sector,
    profile.location,
    profile.stage,
    profile.description,
    profile.vision,
    profile.mission,
    profile.positioning,
    profile.value_proposition,
    profile.business_model,
    profile.target_market,
  ];

  const completed =
    fields.filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    ).length;

  return Math.round(
    (completed / fields.length) *
      100
  );
}


/* =========================================
   AI INSIGHT
========================================= */

function generateBusinessInsight(
  profile,
  offers,
  goals
) {
  if (
    !profile.value_proposition ||
    !profile.value_proposition.trim()
  ) {
    return (
      "Votre proposition de valeur n'est pas encore définie. C'est un élément prioritaire à clarifier pour rendre votre offre plus lisible et différenciante."
    );
  }

  if (offers.length === 0) {
    return (
      "Votre profil business est renseigné, mais aucune offre n'est encore structurée. La prochaine étape consiste à transformer votre proposition de valeur en offres concrètes."
    );
  }

  const activeOffers =
    offers.filter(
      (offer) =>
        offer.status === "active"
    );

  if (activeOffers.length === 0) {
    return (
      "Vous avez des offres enregistrées, mais aucune n'est actuellement active. Clarifiez votre offre principale avant de concentrer vos efforts d'acquisition."
    );
  }

  if (goals.length === 0) {
    return (
      "Votre offre est structurée, mais aucun objectif stratégique n'est encore défini. Fixez quelques objectifs mesurables pour donner une direction claire à votre croissance."
    );
  }

  const completedGoals =
    goals.filter(
      (goal) =>
        goal.status === "done"
    );

  if (
    completedGoals.length ===
    goals.length
  ) {
    return (
      "Vos objectifs actuels sont terminés. C'est le bon moment pour définir la prochaine étape de croissance et actualiser votre roadmap."
    );
  }

  return (
    "Votre proposition de valeur est claire et votre offre est structurée. Le prochain levier consiste à transformer vos objectifs en actions mesurables et à renforcer progressivement votre différenciation."
  );
}


/* =========================================
   DATE
========================================= */

function formatLastUpdate(date) {
  if (!date) {
    return "aujourd'hui";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "aujourd'hui";
  }

  return parsedDate.toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}


export default BusinessOverview;