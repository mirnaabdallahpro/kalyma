import { useState } from "react";

const COLOR_VARS = {
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  primary: "var(--primary)",
};

function GoalRow({ goal, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasTarget = goal.target != null && goal.current != null;
  const pct = hasTarget
    ? Math.min(100, Math.round((goal.current / goal.target) * 100))
    : null;

  const detail = hasTarget
    ? `${pct}%${goal.deadline ? ` · échéance ${goal.deadline}` : ""}`
    : goal.statusLabel || "En cours";

  const dotColor = COLOR_VARS[goal.color] || COLOR_VARS.secondary;

  return (
    <div className="priority goal-row">
      <span className="dot" style={{ background: dotColor }} />

      <div className="goal-row-body">
        <strong>{goal.title}</strong>
        <small>{detail}</small>

        {hasTarget && (
          <div className="goal-progress-track">
            <div
              className="goal-progress-fill"
              style={{ width: `${pct}%`, background: dotColor }}
            />
          </div>
        )}
      </div>

      <div className="row-menu" tabIndex={0} onBlur={() => setMenuOpen(false)}>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Options"
        >
          ⋮
        </button>

        {menuOpen && (
          <div className="row-dropdown">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(goal);
              }}
            >
              Modifier
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => {
                setMenuOpen(false);
                onDelete(goal);
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalRow;
