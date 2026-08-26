import { useState } from "react";
import { convertRecommendationToPlan } from "../../../services/planning";
import Modal from "../shared/Modal";

function PlanActionModal({ recommendation, onClose, onCreated }) {
  const [objectiveTitle, setObjectiveTitle] = useState(recommendation.title || "");
  const [projectTitle, setProjectTitle] = useState(`Plan — ${recommendation.title || ""}`);
  const [tasksText, setTasksText] = useState(
    "Définir les 3 priorités\nLister les actions concrètes\nExécuter la première action cette semaine"
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const taskTitles = tasksText.split("\n").map((t) => t.trim()).filter(Boolean);
      const result = await convertRecommendationToPlan({
        recommendationId: recommendation.id,
        objectiveTitle,
        projectTitle,
        taskTitles,
      });
      onCreated(result);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Transformer en plan d'action"
      subtitle={recommendation.title}
      onClose={onClose}
      width={520}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button type="submit" form="plan-action-form" className="btn btn-primary" disabled={saving}>
            {saving ? "Création…" : "Créer le plan"}
          </button>
        </>
      }
    >
      <form id="plan-action-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Objectif</label>
          <input
            type="text"
            value={objectiveTitle}
            onChange={(e) => setObjectiveTitle(e.target.value)}
            required
          />
        </div>

        <div className="field field-full">
          <label>Projet</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />
        </div>

        <div className="field field-full">
          <label>Tâches (une par ligne)</label>
          <textarea
            rows={6}
            value={tasksText}
            onChange={(e) => setTasksText(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}

export default PlanActionModal;