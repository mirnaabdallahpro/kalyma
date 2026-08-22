import { useState } from "react";
import Modal from "../shared/Modal";

function LostReasonModal({ deal, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      title="Marquer comme perdu"
      subtitle={deal.companyName}
      onClose={onClose}
      width={440}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(reason)}
          >
            Confirmer
          </button>
        </>
      }
    >
      <div className="field field-full">
        <label>Raison (optionnel)</label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Budget, timing, choix d'un concurrent…"
        />
      </div>
    </Modal>
  );
}

export default LostReasonModal;
