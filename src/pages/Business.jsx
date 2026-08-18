import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ProfileOverviewPanel from "../components/business/ProfileOverviewPanel";
import EditProfileModal from "../components/business/EditProfileModal";
import OffersPanel from "../components/business/OffersPanel";
import OfferFormModal from "../components/business/OfferFormModal";
import GoalsPanel from "../components/business/GoalsPanel";
import GoalFormModal from "../components/business/GoalFormModal";
import BusinessAIDiagnostic from "../components/business/BusinessAIDiagnostic";
import AIDiagnosticModal from "../components/business/AIDiagnosticModal";
import ConfirmModal from "../components/business/ConfirmModal";
import "../styles/business.css";

function Business() {
  // --- Business Profile (entité BusinessProfile du cahier des charges) ---
  const [profile, setProfile] = useState({
    companyName: "Kalyma",
    sector: "Conseil & Growth",
    positioning: "Clair",
    icp: "PME B2B",
    description: "",
    valueProposition:
      "Nous aidons les entreprises à transformer leur stratégie commerciale en système de croissance mesurable, grâce au conseil, au marketing et à la technologie.",
    valuePropositionScore: 82,
  });

  // --- Offres (entité Offer) ---
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "Growth Sprint",
      price: "15 000 MAD",
      status: "active",
      description:
        "Accompagnement intensif de 6 semaines pour structurer l'acquisition.",
    },
    {
      id: 2,
      name: "Growth Partner",
      price: "8 000 MAD / mois",
      status: "active",
      description:
        "Abonnement mensuel avec suivi continu, CRM et reporting.",
    },
    {
      id: 3,
      name: "Diagnostic Stratégique",
      price: "3 000 MAD",
      status: "draft",
      description:
        "Audit complet du positionnement et du système commercial.",
    },
  ]);

  // --- Objectifs (entité Goal) ---
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

  // --- UI state ---
  const [editingProfile, setEditingProfile] = useState(false);
  const [offerModal, setOfferModal] = useState(null); // null | "new" | offer
  const [goalModal, setGoalModal] = useState(null); // null | "new" | goal
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, item }
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Complétion du profil (pourra être calculée dynamiquement plus tard)
  const completion = 82;

  const handleSaveProfile = (form) => {
    setProfile((p) => ({ ...p, ...form }));
    setEditingProfile(false);
  };

  const handleSaveOffer = (offer) => {
    setOffers((list) => {
      if (offer.id) {
        return list.map((o) => (o.id === offer.id ? { ...o, ...offer } : o));
      }
      const nextId = list.length ? Math.max(...list.map((o) => o.id)) + 1 : 1;
      return [...list, { ...offer, id: nextId }];
    });
    setOfferModal(null);
  };

  const handleSaveGoal = (goal) => {
    setGoals((list) => {
      if (goal.id) {
        return list.map((g) => (g.id === goal.id ? { ...g, ...goal } : g));
      }
      const nextId = list.length ? Math.max(...list.map((g) => g.id)) + 1 : 1;
      return [...list, { ...goal, id: nextId }];
    });
    setGoalModal(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "offer") {
      setOffers((list) => list.filter((o) => o.id !== deleteTarget.item.id));
    } else {
      setGoals((list) => list.filter((g) => g.id !== deleteTarget.item.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div className="dashboard-body">
      <div className="app">
        <Sidebar />

        <main className="main">
          <Topbar />

          <div className="content">
            {/* Welcome */}
            <div className="welcome">
              <div>
                <h1>Business</h1>
                <p>Le cockpit stratégique de votre entreprise.</p>
              </div>

              <div className="date">Dernière mise à jour : aujourd&apos;hui</div>
            </div>

            {/* Main grid: profile + goals/AI */}
            <div className="grid-main">
              <ProfileOverviewPanel
                profile={{ ...profile, completion, offersCount: offers.length }}
                onEdit={() => setEditingProfile(true)}
              />

              <div>
                <GoalsPanel
                  goals={goals}
                  onAdd={() => setGoalModal("new")}
                  onEdit={(goal) => setGoalModal(goal)}
                  onDelete={(goal) => setDeleteTarget({ type: "goal", item: goal })}
                />

                <BusinessAIDiagnostic
                  insight="Votre proposition de valeur est claire. Le prochain levier à travailler est la preuve sociale et la différenciation de vos offres."
                  onSeeAnalysis={() => setShowDiagnostic(true)}
                />
              </div>
            </div>

            {/* Offers */}
            <div style={{ marginTop: 18 }}>
              <OffersPanel
                offers={offers}
                onAdd={() => setOfferModal("new")}
                onEdit={(offer) => setOfferModal(offer)}
                onDelete={(offer) =>
                  setDeleteTarget({ type: "offer", item: offer })
                }
              />
            </div>
          </div>
        </main>
      </div>

      {editingProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditingProfile(false)}
          onSave={handleSaveProfile}
        />
      )}

      {offerModal && (
        <OfferFormModal
          initialOffer={offerModal === "new" ? null : offerModal}
          onClose={() => setOfferModal(null)}
          onSave={handleSaveOffer}
        />
      )}

      {goalModal && (
        <GoalFormModal
          initialGoal={goalModal === "new" ? null : goalModal}
          onClose={() => setGoalModal(null)}
          onSave={handleSaveGoal}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${
            deleteTarget.item.title || deleteTarget.item.name
          }" ? Cette action est irréversible.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {showDiagnostic && (
        <AIDiagnosticModal
          profile={{ ...profile, offersCount: offers.length }}
          onClose={() => setShowDiagnostic(false)}
        />
      )}
    </div>
  );
}

export default Business;
