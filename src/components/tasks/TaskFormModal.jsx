import { useState } from "react";
import Modal from "../shared/Modal";

const CATEGORIES = ["Business", "CRM", "Commercial", "Marketing", "Stratégie"];

function TaskFormModal({ initialTask, defaultStatus, onClose, onSave }) {
  const isEdit = Boolean(initialTask);

  const [form, setForm] = useState({
    title: initialTask?.title || "",
    category: initialTask?.category || CATEGORIES[0],
    meta: initialTask?.meta || "",
    priorityColor: initialTask?.priorityColor || "accent",
    status: initialTask?.status || defaultStatus || "todo",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const setColor = (priorityColor) => setForm((f) => ({ ...f, priorityColor }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...initialTask, ...form });
  };

  return (
    <Modal
      title={isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
      onClose={onClose}
      width={460}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="task-form" className="btn btn-primary">
            {isEdit ? "Enregistrer" : "Créer la tâche"}
          </button>
        </>
      }
    >
      <form id="task-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Titre</label>
          <input
            type="text"
            value={form.title}
            onChange={update("title")}
            placeholder="Relancer Atlas Consulting"
            required
          />
        </div>

        <div className="field">
          <label>Catégorie</label>
          <select value={form.category} onChange={update("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Échéance / note</label>
          <input
            type="text"
            value={form.meta}
            onChange={update("meta")}
            placeholder="10:00 ou Échéance aujourd'hui"
          />
        </div>

        <div className="field field-full">
          <label>Priorité</label>
          <div className="segmented">
            <button
              type="button"
              className={form.priorityColor === "secondary" ? "active" : ""}
              onClick={() => setColor("secondary")}
            >
              Haute
            </button>
            <button
              type="button"
              className={form.priorityColor === "accent" ? "active" : ""}
              onClick={() => setColor("accent")}
            >
              Moyenne
            </button>
            <button
              type="button"
              className={form.priorityColor === "muted" ? "active" : ""}
              onClick={() => setColor("muted")}
            >
              Basse
            </button>
          </div>
        </div>

        <div className="field field-full">
          <label>Statut</label>
          <select value={form.status} onChange={update("status")}>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}

export default TaskFormModal;
