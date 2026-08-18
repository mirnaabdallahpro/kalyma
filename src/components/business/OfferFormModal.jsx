import { useState } from "react";
import Modal from "./Modal";

function OfferFormModal({ initialOffer, onClose, onSave }) {
  const isEdit = Boolean(initialOffer);

  const [form, setForm] = useState({
    name: initialOffer?.name || "",
    price: initialOffer?.price || "",
    description: initialOffer?.description || "",
    status: initialOffer?.status || "draft",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...initialOffer, ...form });
  };

  return (
    <Modal
      title={isEdit ? "Modifier l'offre" : "Nouvelle offre"}
      onClose={onClose}
      width={480}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="offer-form" className="btn btn-primary">
            {isEdit ? "Enregistrer" : "Créer l'offre"}
          </button>
        </>
      }
    >
      <form id="offer-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Nom de l&apos;offre</label>
          <input
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Growth Sprint"
            required
          />
        </div>

        <div className="field">
          <label>Prix</label>
          <input
            type="text"
            value={form.price}
            onChange={update("price")}
            placeholder="15 000 MAD"
          />
        </div>

        <div className="field">
          <label>Statut</label>
          <select value={form.status} onChange={update("status")}>
            <option value="draft">Brouillon</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div className="field field-full">
          <label>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={update("description")}
            placeholder="Ce que comprend l'offre"
          />
        </div>
      </form>
    </Modal>
  );
}

export default OfferFormModal;
