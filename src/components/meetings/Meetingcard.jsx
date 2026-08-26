function formatDateTime(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const OUTCOME_LABEL = {
  qualifie: "Qualifié",
  a_relancer: "À relancer",
  proposition_envoyee: "Proposition envoyée",
  pas_interesse: "Pas intéressé",
  gagne: "Gagné",
  perdu: "Perdu",
};

function MeetingCard({ meeting, onClose, onDelete }) {
  return (
    <div className="meeting-card">
      <div className="meeting-card-main">
        <strong>{meeting.title}</strong>
        <small>{meeting.companyName} · {formatDateTime(meeting.scheduledAt)}</small>
        {meeting.objective && <small className="meeting-objective">🎯 {meeting.objective}</small>}
        {meeting.videoLink && (
          <a href={meeting.videoLink} target="_blank" rel="noreferrer" className="meeting-link">
            🔗 Rejoindre
          </a>
        )}
        {meeting.status === "done" && (
          <span className={`meeting-outcome meeting-outcome-${meeting.outcome}`}>
            {OUTCOME_LABEL[meeting.outcome] || meeting.outcome}
          </span>
        )}
      </div>

      <div className="meeting-card-actions">
        {meeting.status === "scheduled" && (
          <button type="button" className="btn btn-primary btn-small" onClick={() => onClose(meeting)}>
            Compte-rendu
          </button>
        )}
        <button type="button" className="icon-btn" onClick={() => onDelete(meeting)} aria-label="Supprimer">
          ✕
        </button>
      </div>
    </div>
  );
}

export default MeetingCard;