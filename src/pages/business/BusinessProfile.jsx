import { useState } from "react";

import BusinessCard from "../../components/business/BusinessCard";
import BusinessPageHeader from "../../components/business/BusinessPageHeader";
import BusinessProgress from "../../components/business/BusinessProgress";
import BusinessStatusBadge from "../../components/business/BusinessStatusBadge";

import BusinessProfileIdentity from "../../components/business/profile/BusinessProfileIdentity";
import BusinessProfileModel from "../../components/business/profile/BusinessProfileModel";
import BusinessProfilePositioning from "../../components/business/profile/BusinessProfilePositioning";
import BusinessProfileStrategy from "../../components/business/profile/BusinessProfileStrategy";
import BusinessProfileValue from "../../components/business/profile/BusinessProfileValue";

import EditBusinessProfileModal from "../../components/business/profile/EditBusinessProfileModal";

import "../../styles/business-profile.css";

function BusinessProfile() {
  const [profile, setProfile] = useState({
    companyName: "Kalyma",
    sector: "Conseil & Growth",
    location: "Casablanca, Maroc",
    stage: "En développement",

    description:
      "Kalyma accompagne les entrepreneurs et entreprises dans la structuration et le développement de leur activité.",

    vision:
      "Construire des entreprises plus claires, plus structurées et capables de transformer leur potentiel en croissance durable.",

    mission:
      "Aider les entrepreneurs à clarifier leur stratégie, développer leur acquisition et construire les systèmes nécessaires à leur croissance.",

    ambition:
      "Devenir un acteur de référence de l'accompagnement business des entrepreneurs et PME en Afrique.",

    positioning:
      "Partenaire stratégique des entrepreneurs qui veulent transformer leur activité en véritable système de croissance.",

    category:
      "Conseil stratégique & Growth",

    problemSolved:
      "Manque de clarté stratégique, acquisition irrégulière et absence de système structuré pour piloter la croissance.",

    differentiation:
      "Une approche intégrée combinant stratégie, acquisition, technologie et accompagnement.",

    valueProposition:
      "Nous aidons les entrepreneurs et PME à structurer leur stratégie, leur acquisition et leurs outils afin de construire une croissance mesurable et durable.",

    valueScore: 82,

    businessModel: "Services & accompagnement",

    revenueSources: [
      "Conseil stratégique",
      "Accompagnement",
      "Formation",
      "Technologie / SaaS",
    ],

    targetMarket:
      "Entrepreneurs, indépendants et PME en phase de structuration ou de croissance.",
  });

  const [editingSection, setEditingSection] =
    useState(null);

  const handleSave = (updates) => {
    setProfile((current) => ({
      ...current,
      ...updates,
    }));

    setEditingSection(null);
  };

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
              <strong>82%</strong>
              <span>Profil complété</span>
            </div>

            <BusinessProgress
              value={82}
              showValue={false}
            />

            <div className="profile-completion-list">

              <ProfileCompletionItem
                label="Identité"
                completed
              />

              <ProfileCompletionItem
                label="Vision & Mission"
                completed
              />

              <ProfileCompletionItem
                label="Positionnement"
                completed
              />

              <ProfileCompletionItem
                label="Proposition de valeur"
                completed
              />

              <ProfileCompletionItem
                label="Business Model"
                completed={false}
              />

            </div>
          </BusinessCard>

          <BusinessCard
            title="Score stratégique"
            subtitle="Analyse Kalyma"
            className="profile-score-card"
          >
            <div className="profile-strategic-score">
              <strong>82</strong>
              <span>/100</span>
            </div>

            <BusinessStatusBadge status="success">
              Bonne base
            </BusinessStatusBadge>

            <p>
              Votre positionnement est cohérent.
              Le principal axe d'amélioration concerne
              la différenciation et la formalisation de
              votre proposition de valeur.
            </p>

            <button className="btn btn-primary">
              Voir le diagnostic →
            </button>
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