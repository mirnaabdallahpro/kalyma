import Modal from "../shared/Modal";

function TaskAIModal({ onClose }) {
  return (
    <Modal
      title="Optimiser ma journée"
      subtitle="Recommandation basée sur vos tâches en attente"
      onClose={onClose}
      width={480}
    >
      <div className="diagnostic-list">
        <div className="diagnostic-item">
          <strong>1. Actions commerciales d&apos;abord</strong>
          <p>
            Les relances et rendez-vous ont un impact direct sur votre
            pipeline — traitez-les avant le reste.
          </p>
        </div>

        <div className="diagnostic-item">
          <strong>2. Puis les priorités du diagnostic</strong>
          <p>
            Les recommandations issues de votre diagnostic stratégique
            renforcent votre positionnement à moyen terme.
          </p>
        </div>

        <div className="diagnostic-item">
          <strong>3. Enfin le reste</strong>
          <p>
            Marketing et tâches internes peuvent suivre une fois l&apos;essentiel
            traité.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default TaskAIModal;
