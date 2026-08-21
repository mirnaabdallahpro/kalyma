import TaskCard from "./TaskCard";

const STATUS_LABEL = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

function TaskColumn({
  status,
  tasks,
  draggingId,
  onDragStart,
  onDragEnd,
  onDropBefore,
  onDropEnd,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="task-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropEnd();
      }}
    >
      <div className="task-column-head">
        <h4>{STATUS_LABEL[status]}</h4>
        <span className="muted">{tasks.length}</span>
      </div>

      <div className="task-column-list">
        {tasks.length === 0 && (
          <p className="task-column-empty">Aucune tâche ici.</p>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            dragging={draggingId === task.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropBefore={onDropBefore}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <button type="button" className="task-add-btn" onClick={() => onAdd(status)}>
        + Ajouter
      </button>
    </div>
  );
}

export default TaskColumn;
