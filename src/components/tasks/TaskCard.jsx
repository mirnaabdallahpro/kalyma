import { useState } from "react";

const DOT_COLOR = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  muted: "#b7c0d0",
};

const SOURCE_LABEL = {
  strategy: "Priorité stratégique",
  diagnostic: "Diagnostic IA",
  manual: "Tâche manuelle",
};

function TaskCard({
  task,
  dragging,
  onDragStart,
  onDragEnd,
  onDropBefore,
  onEdit,
  onDelete,
  onArchive,
  onPlanAction,
  onViewDetails,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`task-card-wrap ${dragOver ? "task-drop-before" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        onDropBefore(task.id);
      }}
    >
      <div
        className={`task-card ${dragging ? "task-dragging" : ""}`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", task.id);
          e.dataTransfer.effectAllowed = "move";
          onDragStart(task.id);
        }}
        onDragEnd={onDragEnd}
      >
        <div className="task-card-top">
          <span
            className="dot"
            style={{
              background:
                DOT_COLOR[task.priorityColor] || DOT_COLOR.muted,
            }}
          />

          {/* Source */}
          {task.source && (
            <span className="task-source-badge">
              {SOURCE_LABEL[task.source] || task.source}
            </span>
          )}

          <div className="row-menu">
            {/* Informations */}
            <button
              type="button"
              className="icon-btn task-info-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(task);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Voir les détails"
              title="Voir les détails"
            >
              ⓘ
            </button>

            {/* Menu */}
            <button
              type="button"
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Options"
              title="Options"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="row-dropdown">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                >
                  Modifier
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onArchive(task);
                  }}
                >
                  Archiver
                </button>

                <button
                  type="button"
                  className="danger"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(task);
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu */}
        <strong>{task.title}</strong>

        <small>
          {task.category}
          {task.meta ? ` · ${task.meta}` : ""}
        </small>

        {/* Transformer en plan d'action */}
        {task.source === "diagnostic" &&
          !task.convertedToObjectiveId && (
            <button
              type="button"
              className="deal-quick-qualify"
              style={{ marginTop: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                onPlanAction(task);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              Transformer en plan d&apos;action
            </button>
          )}

        {/* Déjà transformé */}
        {task.source === "diagnostic" &&
          task.convertedToObjectiveId && (
            <span className="task-plan-done">
              ✓ Plan d&apos;action créé
            </span>
          )}
      </div>
    </div>
  );
}

export default TaskCard;