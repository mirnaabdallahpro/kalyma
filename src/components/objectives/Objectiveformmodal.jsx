import { useState } from "react";
import Modal from "../shared/Modal";

function ObjectiveFormModal({ initialObjective, onClose, onSave }) {
  const isEdit = Boolean(initialObjective);

  const [form, setForm] = useState({
    title: initialObjective?.title || "",
    description: initialObjective?.description || "",
    target: initialObjective?.target ?? "",
    current: initialObjective?.current ?? "",
    unit: initialObjective?.unit || "",
    deadline: initialObjective?.deadline || "",
  });

  //
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...initialObjective,
      ...form,
      target: form.target === "" ? null : Number(form.target),
      current: form.current === "" ? null : Number(form.current),
    });
  };

  return (
    <Modal
      title={isEdit ? "Modifier l'objectif" : "Nouvel objectif"}
      onClose={onClose}
      width={480}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button type="submit" form="objective-form" className="btn btn-primary">
            {isEdit ? "Enregistrer" : "Créer l'objectif"}
          </button>
        </>
      }
    >
      <form id="objective-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Titre</label>
          <input type="text" value={form.title} onChange={update("title")} required placeholder="Obtenir 10 prospects qualifiés" />
        </div>

        <div className="field">
          <label>Valeur actuelle</label>
          <input type="number" value={form.current} onChange={update("current")} placeholder="6" />
        </div>

        <div className="field">
          <label>Valeur cible</label>
          <input type="number" value={form.target} onChange={update("target")} placeholder="10" />
        </div>

        <div className="field">
          <label>Unité</label>
          <input type="text" value={form.unit} onChange={update("unit")} placeholder="prospects" />
        </div>

        <div className="field">
          <label>Échéance</label>
          <input type="date" value={form.deadline} onChange={update("deadline")} />
        </div>

        <div className="field field-full">
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={update("description")} />
        </div>
      </form>
    </Modal>
  );
}

export default ObjectiveFormModal;