import { useEffect, useState } from "react";

import BusinessCard from "../../components/business/BusinessCard";
import BusinessPageHeader from "../../components/business/BusinessPageHeader";
import BusinessProgress from "../../components/business/BusinessProgress";
import BusinessStatusBadge from "../../components/business/BusinessStatusBadge";

import BusinessProfileIdentity from "../../components/business/profile/BusinessProfileIdentity";
import BusinessProfileModel from "../../components/business/profile/BusinessProfileModel";
import BusinessProfilePositioning from "../../components/business/profile/BusinessProfilePositioning";
import BusinessProfileStrategy from "../../components/business/profile/BusinessProfileStrategy";
import BusinessProfileValue from "../../components/business/profile/BusinessProfileValue";

import {
  createBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile
} from "../../../services/businessProfileService";
import EditBusinessProfileModal from "../../components/business/profile/EditBusinessProfileModal";

import { mapBusinessProfile } from "../../utils/businessProfileMapper";


import { NavLink } from "react-router-dom";
import "../../styles/business-profile.css";

function BusinessProfile() {
  
   const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);

  const [editingSection, setEditingSection] =
    useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

function calculateProfileCompletion(profile) {
  if (!profile) {
    return 0;
  }

  const fields = [
    profile.companyName,
    profile.sector,
    profile.location,
    profile.stage,
    profile.description,
    profile.vision,
    profile.mission,
    profile.ambition,
    profile.positioning,
    profile.category,
    profile.problemSolved,
    profile.differentiation,
    profile.valueProposition,
    profile.businessModel,
    profile.targetMarket,
  ];

  const completed = fields.filter((value) => {
    if (value === null || value === undefined) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value.trim() !== "";
    }

    return true;
  }).length;

  if (fields.length === 0) {
    return 0;
  }

  return Math.round(
    (completed / fields.length) * 100
  );
}

function getProfileCompletionStatus(score) {
  if (score >= 80) {
    return {
      status: "success",
      label: "Excellent niveau",
    };
  }

  if (score >= 60) {
    return {
      status: "success",
      label: "Bonne base",
    };
  }

  if (score >= 40) {
    return {
      status: "warning",
      label: "À développer",
    };
  }

  if (score >= 20) {
    return {
      status: "warning",
      label: "Encore incomplet",
    };
  }

  return {
    status: "danger",
    label: "À construire",
  };
}

const completion =
  calculateProfileCompletion(profile);


 async function loadProfile() {
  try {
    setLoading(true);
    setError(null);

    console.log("1. Recherche du profil...");

    let data = await getBusinessProfile();

    console.log("2. Profil récupéré :", data);

    if (!data) {
      console.log("3. Aucun profil → création...");

      data = await createBusinessProfile();

      console.log("4. Profil créé :", data);
    }

    console.log("5. Mapping du profil...");

    setProfile(mapBusinessProfile(data));

  } catch (err) {
    console.error("❌ ERREUR LOAD PROFILE :", err);
    console.error("message:", err?.message);
    console.error("code:", err?.code);
    console.error("details:", err?.details);
    console.error("hint:", err?.hint);

    setError(
      "Impossible de charger votre profil Business."
    );
  } finally {
    setLoading(false);
  }
}



  async function handleSave(updates) {
    try {
      setSaving(true);
      setError(null);

      const updated =
        await updateBusinessProfile(updates);

      setProfile(
        mapBusinessProfile(updated)
      );

      setEditingSection(null);
    } catch (err) {
      console.error(err);

      setError(
        "Impossible d'enregistrer les modifications."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="business-profile-loading">
        Chargement du profil...
      </div>
    );
  }

   if (error) {
    return (
      <div className="business-profile-error">
        {error}

        <button
          className="btn btn-primary"
          onClick={loadProfile}
        >
          Réessayer
        </button>
      </div>
    );
  }


if (!profile) {
    return (
      <EmptyBusinessProfile
        onCreate={async () => {
          try {
            setSaving(true);

            const data =
              await createBusinessProfile({
                companyName: "",
                sector: "",
                location: "",
                stage: "",

                description: "",

                vision: "",
                mission: "",
                ambition: "",

                positioning: "",
                category: "",

                problemSolved: "",
                differentiation: "",

                valueProposition: "",

                valueScore: 0,

                businessModel: "",

                revenueSources: [],

                targetMarket: "",
              });

              setProfile(
              mapBusinessProfile(data)
            );
          } catch (err) {
            console.error(err);

            setError(
              "Impossible de créer votre profil Business."
            );
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
      />
    );
  }

function getProfileCompletionItems(profile) {
  return [
    {
      label: "Identité",
      completed: Boolean(
        profile?.companyName &&
        profile?.sector &&
        profile?.location &&
        profile?.stage
      ),
    },
    {
      label: "Vision & Mission",
      completed: Boolean(
        profile?.vision &&
        profile?.mission
      ),
    },
    {
      label: "Positionnement",
      completed: Boolean(
        profile?.positioning &&
        profile?.category
      ),
    },
    {
      label: "Proposition de valeur",
      completed: Boolean(
        profile?.valueProposition
      ),
    },
    {
      label: "Business Model",
      completed: Boolean(
        profile?.businessModel &&
        profile?.revenueSources?.length
      ),
    },
  ];
}

const completion2 = calculateProfileCompletion(profile);

const completionStatus = getProfileCompletionStatus(completion);

const completionItems = getProfileCompletionItems(profile);


  return (
    <div className="business-profile-page">

      <BusinessPageHeader
        title="Profil Business"
        description="La base stratégique de votre entreprise."
        meta="Dernière mise à jour : aujourd'hui"
      />

      <div className="business-profile-layout">

        {/* Colonne principale */}
        <div className="business-profile-main">

          <BusinessProfileIdentity
            profile={profile}
            onEdit={() =>
              setEditingSection("identity")
            }
          />

          <BusinessProfileStrategy
            profile={profile}
            onEdit={() =>
              setEditingSection("strategy")
            }
          />

          <BusinessProfilePositioning
            profile={profile}
            onEdit={() =>
              setEditingSection("positioning")
            }
          />

          <BusinessProfileValue
            profile={profile}
            onEdit={() =>
              setEditingSection("value")
            }
          />

          <BusinessProfileModel
            profile={profile}
            onEdit={() =>
              setEditingSection("model")
            }
          />

        </div>

        {/* Sidebar */}
        <aside className="business-profile-sidebar">

          <BusinessCard
  title="Complétion du profil"
  subtitle="Votre fondation stratégique"
>
  <div className="profile-completion-score">
    <strong>{completion2}%</strong>

    <span>
      {completionStatus.label}
    </span>
  </div>

  <BusinessProgress
    value={completion2}
    showValue={false}
  />

  <div className="profile-completion-list">
    {completionItems.map((item) => (
      <ProfileCompletionItem
        key={item.label}
        label={item.label}
        completed={item.completed}
      />
    ))}
  </div>
</BusinessCard>

          <BusinessCard
            title="Score stratégique"
            subtitle="Analyse Kalyma"
            className="profile-score-card"
          >
            <div className="profile-strategic-score">
              <strong>{calculateProfileCompletion(profile)}</strong>
              <span>/100</span>
            </div>

            <BusinessStatusBadge status={getProfileCompletionStatus(calculateProfileCompletion(profile)).status}>
             {getProfileCompletionStatus(calculateProfileCompletion(profile)).label}
            </BusinessStatusBadge>

          <p>
            Votre diagnostic stratégique apparaîtra ici une fois disponible.
          </p>

          <NavLink to={"/business/diagnostics"} className="btn btn-primary">
            Voir le diagnostic →
          </NavLink>
          </BusinessCard>

        </aside>
      </div>

      {editingSection && (
        <EditBusinessProfileModal
          profile={profile}
          section={editingSection}
          onClose={() =>
            setEditingSection(null)
          }
          onSave={handleSave}
        />
      )}

    </div>
  );
}

function ProfileCompletionItem({
  label,
  completed,
}) {
  return (
    <div className="profile-completion-item">
      <span
        className={
          completed
            ? "completion-check completed"
            : "completion-check"
        }
      >
        {completed ? "✓" : ""}
      </span>

      <span>{label}</span>
    </div>
  );
}

export default BusinessProfile;