import { useState } from "react";
import TaskAIModal from "./TaskAIModal";

function TaskAIPanel({ task }) {
  const [open, setOpen] = useState(false);

  const insight = task
    ? `Terminez d'abord "${task.title}" : c'est votre tâche à plus fort impact en attente.`
    : "Aucune tâche à haute priorité en attente — bon rythme.";

  return (
    <>
      <section className="ai" style={{ marginTop: 18 }}>
        <span className="tag">KALYMA AI</span>
        <h3>Votre priorité</h3>
        <p>{insight}</p>
        <button type="button" onClick={() => setOpen(true)}>
          Optimiser ma journée →
        </button>
      </section>

      {open && <TaskAIModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default TaskAIPanel;
