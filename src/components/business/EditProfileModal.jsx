import { useState } from "react";
import Modal from "./Modal";

function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    companyName: profile.companyName || "",
    sector: profile.sector || "",
    positioning: profile.positioning || "",
    icp: profile.icp || "",
    description: profile.description || "",
    valueProposition: profile.valueProposition || "",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal
      title="Modifier le profil business"
      subtitle="Ces informations alimentent votre diagnostic Kalyma AI"
      onClose={onClose}
      width={560}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="profile-form" className="btn btn-primary">
            Enregistrer
          </button>
        </>
      }
    >
      <form id="profile-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nom de l&apos;entreprise</label>
          <input
            type="text"
            value={form.companyName}
            onChange={update("companyName")}
            placeholder="Kalyma"
            required
          />
        </div>

        <div className="field">
          <label>Secteur</label>
          <input
            type="text"
            value={form.sector}
            onChange={update("sector")}
            placeholder="Conseil & Growth"
          />
        </div>

        <div className="field">
          <label>Positionnement</label>
          <select value={form.positioning} onChange={update("positioning")}>
            <option value="">Sélectionner</option>
            <option value="Clair">Clair</option>
            <option value="En cours">En cours</option>
            <option value="À définir">À définir</option>
          </select>
        </div>

        <div className="field">
          <label>ICP (client idéal)</label>
          <input
            type="text"
            value={form.icp}
            onChange={update("icp")}
            placeholder="PME B2B"
          />
        </div>

        <div className="field field-full">
          <label>Description de l&apos;entreprise</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={update("description")}
            placeholder="Décrivez votre activité en quelques lignes"
          />
        </div>

        <div className="field field-full">
          <label>Proposition de valeur</label>
          <textarea
            rows={3}
            value={form.valueProposition}
            onChange={update("valueProposition")}
            placeholder="Ce que vous apportez à vos clients, en une ou deux phrases"
          />
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
