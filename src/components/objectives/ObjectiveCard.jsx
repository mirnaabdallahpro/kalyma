function ObjectiveCard({ objective, onEdit, onDelete }) {
  const hasTarget = objective.target != null && objective.current != null;
  const pct = hasTarget ? Math.min(100, Math.round((objective.current / objective.target) * 100)) : null;

  return (
    <div className="objective-card">
      <div className="objective-card-top">
        <span className={`objective-status objective-status-${objective.status}`}>
          {objective.status === "done" ? "Atteint" : objective.status === "late" ? "En retard" : "En cours"}
        </span>

        <div className="row-menu-static">
          <button type="button" onClick={() => onEdit(objective)}>Modifier</button>
          <button type="button" className="danger" onClick={() => onDelete(objective)}>Supprimer</button>
        </div>
      </div>

      <h3>{objective.title}</h3>
      {objective.description && <p className="objective-desc">{objective.description}</p>}

      {hasTarget && (
        <>
          <div className="objective-progress-track">
            <div className="objective-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <small className="muted">
            {objective.current} / {objective.target} {objective.unit} · {pct}%
          </small>
        </>
      )}

      <div className="objective-meta">
        {objective.projectsCount != null && (
          <span>{objective.projectsCount} projet{objective.projectsCount > 1 ? "s" : ""}</span>
        )}
        {objective.deadline && <span>Échéance : {objective.deadline}</span>}
        {objective.sourceRecommendationId && <span className="objective-from-ai">Issu du diagnostic IA</span>}
      </div>
    </div>
  );
}

export default ObjectiveCard;