import { useEffect, useState } from "react";
import { createObjective, deleteObjective, getObjectives, updateObjective } from "../../services/planning";
import ObjectiveCard from "../components/objectives/ObjectiveCard";
import ObjectiveFormModal from "../components/objectives/ObjectiveFormModal";
import ConfirmModal from "../components/shared/ConfirmModal";
import "../styles/planning.css";

function Objectives() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [formState, setFormState] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setErrorMsg("");
      setObjectives(await getObjectives());
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de charger les objectifs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    try {
      if (form.id) {
        const updated = await updateObjective(form.id, form);
        setObjectives((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      } else {
        const created = await createObjective(form);
        setObjectives((prev) => [...prev, created]);
      }
      setFormState(null);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible d'enregistrer l'objectif.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteObjective(deleteTarget.id);
      setObjectives((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de supprimer.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
   
      <div className="app">
       
        
          <div className="content">
            <div className="welcome">
              <div>
                <h1>Objectifs</h1>
                <p>Le lien entre votre diagnostic et vos résultats mesurables.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setFormState({})}>
                + Nouvel objectif
              </button>
            </div>

            {errorMsg && (
              <div className="task-error-banner">
                {errorMsg}
                <button type="button" onClick={load}>Réessayer</button>
              </div>
            )}

            {loading ? (
              <p className="task-loading">Chargement…</p>
            ) : objectives.length === 0 ? (
              <p className="empty-state">
                Aucun objectif pour l&apos;instant. Ils se créent aussi automatiquement
                quand tu transformes une recommandation du diagnostic en plan d&apos;action.
              </p>
            ) : (
              <div className="objectives-grid">
                {objectives.map((o) => (
                  <ObjectiveCard
                    key={o.id}
                    objective={o}
                    onEdit={(obj) => setFormState(obj)}
                    onDelete={(obj) => setDeleteTarget(obj)}
                  />
                ))}
              </div>
            )}
          </div>
       
    

      {formState && (
        <ObjectiveFormModal
          initialObjective={formState.id ? formState : null}
          onClose={() => setFormState(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${deleteTarget.title}" ? Les projets et tâches liés resteront mais perdront leur objectif.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default Objectives;