import { useState } from "react";
import Modal from "../shared/Modal";

function MeetingFormModal({ prospect, onClose, onSave }) {
  const [form, setForm] = useState({
    title: `RDV — ${prospect.companyName}`,
    objective: "",
    date: "",
    time: "",
    videoLink: "",
    prepNotes: "",
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledAt = new Date(`${form.date}T${form.time || "09:00"}`).toISOString();
    onSave({
      prospectId: prospect.id,
      title: form.title,
      objective: form.objective,
      scheduledAt,
      videoLink: form.videoLink,
      prepNotes: form.prepNotes,
    });
  };

  return (
    <Modal
      title="Programmer un rendez-vous"
      subtitle={prospect.companyName}
      onClose={onClose}
      width={480}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button type="submit" form="meeting-form" className="btn btn-primary">Programmer</button>
        </>
      }
    >
      <form id="meeting-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Titre</label>
          <input type="text" value={form.title} onChange={update("title")} required />
        </div>

        <div className="field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={update("date")} required />
        </div>

        <div className="field">
          <label>Heure</label>
          <input type="time" value={form.time} onChange={update("time")} />
        </div>

        <div className="field field-full">
          <label>Objectif du rendez-vous</label>
          <input type="text" value={form.objective} onChange={update("objective")} placeholder="Présenter l'offre Growth Sprint" />
        </div>

        <div className="field field-full">
          <label>Lien visio</label>
          <input type="text" value={form.videoLink} onChange={update("videoLink")} placeholder="https://meet.google.com/…" />
        </div>

        <div className="field field-full">
          <label>Notes de préparation</label>
          <textarea rows={3} value={form.prepNotes} onChange={update("prepNotes")} />
        </div>
      </form>
    </Modal>
  );
}

export default MeetingFormModal;
