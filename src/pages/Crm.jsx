import { useEffect, useState } from "react";
import {
  completeRelance,
  createProspect,
  deleteProspect,
  getOffersForSelect,
  getProspects,
  getRelanceSettings,
  getUpcomingRelances,
  markProspectLost,
  markProspectWon,
  qualifyProspect,
  reorderProspects,
  restartNurturingSequence,
  skipRelance,
  updateProspect,
  updateRelanceSettings,
} from "../../services/crm";
import ClosedDealsList from "../components/crm/ClosedDealsList";
import ImportProspectsModal from "../components/crm/ImportProspectsModal";
import LostReasonModal from "../components/crm/LostReasonModal";
import PipelineBoard from "../components/crm/PipelineBoard";
import ProspectFormModal from "../components/crm/ProspectFormModal";
import QualificationModal from "../components/crm/QualificationModal";
import RelanceSettingsModal from "../components/crm/RelanceSettingsModal";
import RelancesPanel from "../components/crm/RelancesPanel";
import StatsCards from "../components/crm/StatsCards";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ConfirmModal from "../components/shared/ConfirmModal";
import "../styles/crm.css";

const TABS = [
  { key: "pipeline", label: "Pipeline actif" },
  { key: "gagne", label: "Clients signés" },
  { key: "perdu", label: "Perdus" },
];

function Crm() {
  const [deals, setDeals] = useState([]);
  const [offers, setOffers] = useState([]);
  const [relances, setRelances] = useState([]);
  const [relanceSettings, setRelanceSettings] = useState({ intervals: [3, 7, 30], enabled: true });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [tab, setTab] = useState("pipeline");
  const [draggingId, setDraggingId] = useState(null);

  const [formState, setFormState] = useState(null); // null | { stage } | deal
  const [lostTarget, setLostTarget] = useState(null);
  const [qualifyTarget, setQualifyTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const loadAll = async () => {
    try {
      setErrorMsg("");
      const [dealsData, offersData, relancesData, settingsData] = await Promise.all([
        getProspects(),
        getOffersForSelect(),
        getUpcomingRelances(),
        getRelanceSettings(),
      ]);
      setDeals(dealsData);
      setOffers(offersData);
      setRelances(relancesData);
      setRelanceSettings(settingsData);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de charger le CRM pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const findDeal = (id) => deals.find((d) => d.id === id);

  const moveDeal = async (dealId, newStage, beforeId) => {
    const dragged = findDeal(dealId);
    if (!dragged) return;

    const rest = deals.filter((d) => d.id !== dealId);
    const updated = { ...dragged, stage: newStage };

    let next;
    if (!beforeId) {
      next = [...rest, updated];
    } else {
      const idx = rest.findIndex((d) => d.id === beforeId);
      next = idx === -1 ? [...rest, updated] : [...rest.slice(0, idx), updated, ...rest.slice(idx)];
    }

    setDeals(next);

    const orderedIds = next.filter((d) => d.stage === newStage).map((d) => d.id);

    try {
      await reorderProspects(orderedIds, dealId, newStage);

      // Un lead qui bascule en Nurturing repart sur une séquence de
      // relances fraîche (J3/J7/J30…) à partir de maintenant.
      if (newStage === "nurturing" && dragged.stage !== "nurturing") {
        await restartNurturingSequence(dealId);
        const freshRelances = await getUpcomingRelances();
        setRelances(freshRelances);
      }
    } catch (err) {
      setErrorMsg(err?.message || "Le déplacement n'a pas pu être enregistré.");
      loadAll();
    }
  };

  const handleSaveDeal = async (form) => {
    try {
      if (form.id) {
        const updated = await updateProspect(form.id, form);
        setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      } else {
        const created = await createProspect(form);
        setDeals((prev) => [...prev, created]);
        const freshRelances = await getUpcomingRelances();
        setRelances(freshRelances);
      }
      setFormState(null);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible d'enregistrer l'opportunité.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProspect(deleteTarget.id);
      setDeals((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setRelances((prev) => prev.filter((r) => r.prospectId !== deleteTarget.id));
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de supprimer l'opportunité.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleWon = async (deal) => {
    try {
      const updated = await markProspectWon(deal.id);
      setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setRelances((prev) => prev.filter((r) => r.prospectId !== deal.id));
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de marquer ce deal comme gagné.");
    }
  };

  const handleConfirmLost = async (reason) => {
    if (!lostTarget) return;
    try {
      const updated = await markProspectLost(lostTarget.id, reason);
      setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setRelances((prev) => prev.filter((r) => r.prospectId !== lostTarget.id));
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de marquer ce deal comme perdu.");
    } finally {
      setLostTarget(null);
    }
  };

  const handleQualify = async (criteria) => {
    if (!qualifyTarget) return;
    try {
      const { prospect } = await qualifyProspect(qualifyTarget.id, criteria);
      setDeals((prev) => prev.map((d) => (d.id === prospect.id ? prospect : d)));
      if (prospect.stage === "nurturing") {
        const freshRelances = await getUpcomingRelances();
        setRelances(freshRelances);
      }
    } catch (err) {
      setErrorMsg(err?.message || "Impossible d'enregistrer la qualification.");
    } finally {
      setQualifyTarget(null);
    }
  };

  const handleCompleteRelance = async (id) => {
    setRelances((prev) => prev.filter((r) => r.id !== id));
    try {
      await completeRelance(id);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de mettre à jour la relance.");
      loadAll();
    }
  };

  const handleSkipRelance = async (id) => {
    setRelances((prev) => prev.filter((r) => r.id !== id));
    try {
      await skipRelance(id);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de mettre à jour la relance.");
      loadAll();
    }
  };

  const handleSaveSettings = async (settings) => {
    try {
      const saved = await updateRelanceSettings(settings);
      setRelanceSettings(saved);
      setSettingsOpen(false);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible d'enregistrer la configuration.");
    }
  };

  const wonDeals = deals.filter((d) => d.stage === "gagne");
  const lostDeals = deals.filter((d) => d.stage === "perdu");

  return (
    <div className="dashboard-body">
      <div className="app">
        <Sidebar />

        <main className="main">
          <Topbar />

          <div className="content">
            <div className="welcome">
              <div>
                <h1>CRM</h1>
                <p>Transformez vos opportunités en clients.</p>
              </div>

              <div className="crm-header-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setImportOpen(true)}
                  disabled={offers.length === 0}
                  title={offers.length === 0 ? "Crée d'abord une offre" : "Importer un CSV/Excel"}
                >
                  ⇪ Importer un CSV
                </button>

                <button
                  type="button"
                  className="btn btn-yellow"
                  onClick={() => setFormState({ stage: "lead" })}
                >
                  + Nouvelle opportunité
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="task-error-banner">
                {errorMsg}
                <button type="button" onClick={loadAll}>
                  Réessayer
                </button>
              </div>
            )}

            <div className="crm-tabs">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={tab === t.key ? "active" : ""}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="task-loading">Chargement du CRM…</p>
            ) : (
              <>
                {tab === "pipeline" && (
                  <PipelineBoard
                    deals={deals.filter((d) =>
                      ["lead", "qualification", "nurturing", "rdv"].includes(d.stage)
                    )}
                    draggingId={draggingId}
                    onDragStart={setDraggingId}
                    onDragEnd={() => setDraggingId(null)}
                    onDropBefore={(beforeId, stage) => moveDeal(draggingId, stage, beforeId)}
                    onDropEnd={(stage) => moveDeal(draggingId, stage, null)}
                    onEdit={(deal) => setFormState(deal)}
                    onDelete={(deal) => setDeleteTarget(deal)}
                    onWon={handleWon}
                    onLost={(deal) => setLostTarget(deal)}
                    onQualify={(deal) => setQualifyTarget(deal)}
                  />
                )}

                {tab === "gagne" && <ClosedDealsList deals={wonDeals} variant="gagne" />}
                {tab === "perdu" && <ClosedDealsList deals={lostDeals} variant="perdu" />}

                <StatsCards deals={deals} pendingRelancesCount={relances.length} />

                <RelancesPanel
                  relances={relances}
                  onComplete={handleCompleteRelance}
                  onSkip={handleSkipRelance}
                  onOpenSettings={() => setSettingsOpen(true)}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {formState && (
        <ProspectFormModal
          initialDeal={formState.id ? formState : null}
          defaultStage={formState.stage}
          offers={offers}
          onClose={() => setFormState(null)}
          onSave={handleSaveDeal}
        />
      )}

      {lostTarget && (
        <LostReasonModal
          deal={lostTarget}
          onClose={() => setLostTarget(null)}
          onConfirm={handleConfirmLost}
        />
      )}

      {qualifyTarget && (
        <QualificationModal
          deal={qualifyTarget}
          onClose={() => setQualifyTarget(null)}
          onSave={handleQualify}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${deleteTarget.companyName}" ? Cette action est irréversible.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {importOpen && (
        <ImportProspectsModal
          offers={offers}
          onClose={() => setImportOpen(false)}
          onImported={loadAll}
        />
      )}

      {settingsOpen && (
        <RelanceSettingsModal
          initialSettings={relanceSettings}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}

export default Crm;