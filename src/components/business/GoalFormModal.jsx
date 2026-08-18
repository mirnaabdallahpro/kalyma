import { useState } from "react";
import Modal from "./Modal";

function GoalFormModal({ initialGoal, onClose, onSave }) {
  const isEdit = Boolean(initialGoal);
  const [mode, setMode] = useState(
    initialGoal?.target != null ? "numeric" : "status"
  );

  const [form, setForm] = useState({
    title: initialGoal?.title || "",
    target: initialGoal?.target ?? "",
    current: initialGoal?.current ?? "",
    deadline: initialGoal?.deadline || "",
    statusLabel: initialGoal?.statusLabel || "En cours",
    color: initialGoal?.color || "secondary",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const setColor = (color) => setForm((f) => ({ ...f, color }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...initialGoal,
      title: form.title,
      color: form.color,
      deadline: mode === "numeric" ? form.deadline : "",
      target: mode === "numeric" ? Number(form.target) : null,
      current: mode === "numeric" ? Number(form.current) : null,
      statusLabel: mode === "status" ? form.statusLabel : null,
    };
    onSave(payload);
  };

  return (
    <Modal
      title={isEdit ? "Modifier l'objectif" : "Nouvel objectif"}
      onClose={onClose}
      width={480}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="goal-form" className="btn btn-primary">
            {isEdit ? "Enregistrer" : "Créer l'objectif"}
          </button>
        </>
      }
    >
      <form id="goal-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Titre de l&apos;objectif</label>
          <input
            type="text"
            value={form.title}
            onChange={update("title")}
            placeholder="Atteindre 50 000 MAD / mois"
            required
          />
        </div>

        <div className="field field-full">
          <label>Type de suivi</label>
          <div className="segmented">
            <button
              type="button"
              className={mode === "numeric" ? "active" : ""}
              onClick={() => setMode("numeric")}
            >
              Chiffré
            </button>
            <button
              type="button"
              className={mode === "status" ? "active" : ""}
              onClick={() => setMode("status")}
            >
              Statut
            </button>
          </div>
        </div>

        {mode === "numeric" ? (
          <>
            <div className="field">
              <label>Valeur actuelle</label>
              <input
                type="number"
                value={form.current}
                onChange={update("current")}
                placeholder="31200"
              />
            </div>
            <div className="field">
              <label>Valeur cible</label>
              <input
                type="number"
                value={form.target}
                onChange={update("target")}
                placeholder="50000"
              />
            </div>
            <div className="field field-full">
              <label>Échéance</label>
              <input
                type="text"
                value={form.deadline}
                onChange={update("deadline")}
                placeholder="décembre"
              />
            </div>
          </>
        ) : (
          <div className="field field-full">
            <label>Statut</label>
            <input
              type="text"
              value={form.statusLabel}
              onChange={update("statusLabel")}
              placeholder="En cours"
            />
          </div>
        )}

        <div className="field field-full">
          <label>Couleur</label>
          <div className="segmented">
            <button
              type="button"
              className={form.color === "secondary" ? "active" : ""}
              onClick={() => setColor("secondary")}
            >
              Jaune
            </button>
            <button
              type="button"
              className={form.color === "accent" ? "active" : ""}
              onClick={() => setColor("accent")}
            >
              Bleu clair
            </button>
            <button
              type="button"
              className={form.color === "primary" ? "active" : ""}
              onClick={() => setColor("primary")}
            >
              Marine
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default GoalFormModal;
