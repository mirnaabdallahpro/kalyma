function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMinutes = (minutes) => {
    if (!minutes) return "Non estimé";

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    return remaining
      ? `${hours} h ${remaining} min`
      : `${hours} h`;
  };

  const statusLabel = {
    todo: "À faire",
    in_progress: "En cours",
    done: "Terminé",
  };

  const priorityLabel = {
    low: "Faible",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
  };

  return (
    <div className="task-details-overlay" onClick={onClose}>
      <div
        className="task-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-details-header">
          <div>
            <span className="task-details-eyebrow">
              Détails de la tâche
            </span>

            <h2>{task.title}</h2>
          </div>

          <button
            type="button"
            className="task-details-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="task-details-content">
          {/* Description */}
          <section className="task-details-section">
            <h3>Description</h3>

            <p>
              {task.notes || "Aucune description renseignée."}
            </p>
          </section>

          {/* Informations principales */}
          <section className="task-details-section">
            <h3>Informations</h3>

            <div className="task-details-grid">
              <div className="task-detail-item">
                <span>Statut</span>
                <strong>
                  {statusLabel[task.status] || task.status || "—"}
                </strong>
              </div>

              <div className="task-detail-item">
                <span>Priorité</span>
                <strong>
                  {priorityLabel[task.priority] || task.priority || "—"}
                </strong>
              </div>

              <div className="task-detail-item">
                <span>Catégorie</span>
                <strong>{task.category || "—"}</strong>
              </div>

              <div className="task-detail-item">
                <span>Temps estimé</span>
                <strong>
                  {formatMinutes(task.estimatedMinutes)}
                </strong>
              </div>

              <div className="task-detail-item">
                <span>Échéance</span>
                <strong>
                  {formatDate(task.dueDate)}
                </strong>
              </div>

              <div className="task-detail-item">
                <span>Source</span>
                <strong>
                  {task.source === "diagnostic"
                    ? "Diagnostic IA"
                    : task.source === "strategy"
                    ? "Priorité stratégique"
                    : "Manuelle"}
                </strong>
              </div>
            </div>
          </section>

          {/* Relations */}
          {(task.objective_id ||
            task.project_id ||
            task.prospect_id ||
            task.depends_on_task_id) && (
            <section className="task-details-section">
              <h3>Relations</h3>

              <div className="task-details-grid">
                {task.objective_id && (
                  <div className="task-detail-item">
                    <span>Objectif</span>
                    <strong>{task.objective_id}</strong>
                  </div>
                )}

                {task.project_id && (
                  <div className="task-detail-item">
                    <span>Projet</span>
                    <strong>{task.project_id}</strong>
                  </div>
                )}

                {task.prospect_id && (
                  <div className="task-detail-item">
                    <span>Prospect</span>
                    <strong>{task.prospect_id}</strong>
                  </div>
                )}

                {task.depends_on_task_id && (
                  <div className="task-detail-item">
                    <span>Dépend de</span>
                    <strong>{task.depends_on_task_id}</strong>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Dates */}
          <section className="task-details-section">
            <h3>Historique</h3>

            <div className="task-details-grid">
              <div className="task-detail-item">
                <span>Créée le</span>
                <strong>
                  {formatDateTime(task.created_at)}
                </strong>
              </div>

              <div className="task-detail-item">
                <span>Dernière modification</span>
                <strong>
                  {formatDateTime(task.updated_at)}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <div className="task-details-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;