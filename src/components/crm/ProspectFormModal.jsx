import { useState } from "react";
import Modal from "../shared/Modal";

const SOURCES = ["LinkedIn", "Referral", "SEO", "Codeur.com", "WhatsApp", "Autre"];

function ProspectFormModal({ initialDeal, defaultStage, offers, onClose, onSave }) {
  const isEdit = Boolean(initialDeal);

  const [form, setForm] = useState({
    companyName: initialDeal?.companyName || "",
    contactName: initialDeal?.contactName || "",
    contactEmail: initialDeal?.contactEmail || "",
    contactPhone: initialDeal?.contactPhone || "",
    offerId: initialDeal?.offer?.id || offers[0]?.id || "",
    source: initialDeal?.source || SOURCES[0],
    amount: initialDeal?.amount ?? "",
    notes: initialDeal?.notes || "",
    stage: initialDeal?.stage || defaultStage || "lead",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      amount: form.amount === "" ? null : Number(form.amount),
    });
  };

  const noOffers = offers.length === 0;

  return (
    <Modal
      title={isEdit ? "Modifier l'opportunité" : "Nouvelle opportunité"}
      onClose={onClose}
      width={560}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            form="prospect-form"
            className="btn btn-primary"
            disabled={noOffers}
          >
            {isEdit ? "Enregistrer" : "Créer l'opportunité"}
          </button>
        </>
      }
    >
      {noOffers ? (
        <p className="empty-state">
          Tu n&apos;as pas encore d&apos;offre créée. Ajoute d&apos;abord une offre
          dans le module Business — chaque opportunité doit être rattachée à
          une offre.
        </p>
      ) : (
        <form id="prospect-form" className="form-grid" onSubmit={handleSubmit}>
          <div className="field field-full">
            <label>Entreprise</label>
            <input
              type="text"
              value={form.companyName}
              onChange={update("companyName")}
              placeholder="Atlas Consulting"
              required
            />
          </div>

          <div className="field">
            <label>Contact</label>
            <input
              type="text"
              value={form.contactName}
              onChange={update("contactName")}
              placeholder="Nom du contact"
            />
          </div>

          <div className="field">
            <label>Offre</label>
            <select value={form.offerId} onChange={update("offerId")} required>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={update("contactEmail")}
              placeholder="contact@entreprise.com"
            />
          </div>

          <div className="field">
            <label>Téléphone</label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={update("contactPhone")}
              placeholder="+212 6 00 00 00 00"
            />
          </div>

          <div className="field">
            <label>Source</label>
            <select value={form.source} onChange={update("source")}>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Montant estimé (MAD)</label>
            <input
              type="number"
              value={form.amount}
              onChange={update("amount")}
              placeholder="8000"
            />
          </div>

          {!isEdit && (
            <div className="field field-full">
              <label>Étape de départ</label>
              <select value={form.stage} onChange={update("stage")}>
                <option value="lead">Lead</option>
                <option value="rdv">RDV</option>
                <option value="proposition">Proposition</option>
                <option value="negociation">Négociation</option>
              </select>
            </div>
          )}

          <div className="field field-full">
            <label>Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={update("notes")}
              placeholder="Contexte, besoin exprimé, prochaine étape…"
            />
          </div>
        </form>
      )}
    </Modal>
  );
}

export default ProspectFormModal;
