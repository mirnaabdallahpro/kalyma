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
};

function TaskCard({ task, dragging, onDragStart, onDragEnd, onDropBefore, onEdit, onDelete }) {
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
            style={{ background: DOT_COLOR[task.priorityColor] || DOT_COLOR.muted }}
          />

          {task.source !== "manual" && (
            <span className="task-source-badge">{SOURCE_LABEL[task.source]}</span>
          )}

          <div className="row-menu">
            <button
              type="button"
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Options"
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

        <strong>{task.title}</strong>
        <small>
          {task.category}
          {task.meta ? ` · ${task.meta}` : ""}
        </small>
      </div>
    </div>
  );
}

export default TaskCard;
