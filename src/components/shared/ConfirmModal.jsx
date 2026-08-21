import Modal from "./Modal";

function ConfirmModal({
  title = "Confirmer la suppression",
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Supprimer",
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      width={400}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Annuler
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="confirm-message">{message}</p>
    </Modal>
  );
}

export default ConfirmModal;
