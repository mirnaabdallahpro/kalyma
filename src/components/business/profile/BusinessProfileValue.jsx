import ComingSoonOverlay from "../../shared/ComingSoonOverlay";
import BusinessCard from "../BusinessCard";
import BusinessProgress from "../BusinessProgress";


function BusinessProfileValue({ profile, onEdit }) {
  const score = profile?.valueScore ?? 0;
  const valueProposition =
    profile?.valueProposition ||
    "Aucune proposition de valeur n'a encore été définie.";

  return (
    <BusinessCard
      title="Proposition de valeur"
      subtitle="La promesse centrale faite à vos clients."
      action={
        <button
          type="button"
          className="business-edit-button"
          onClick={onEdit}
        >
          Modifier
        </button>
      }
    >
      <div className="profile-value-content">

        {/* Proposition de valeur */}
        <div className="profile-value-text">
          <span className="profile-field-label">
            Proposition principale
          </span>

          <blockquote>
            “{valueProposition}”
          </blockquote>
        </div>

        {/* Score */}
        <ComingSoonOverlay>
        <div className="profile-value-score">
          <div className="profile-value-score-header">
            <span>Score Kalyma</span>

            <strong>{score}/100</strong>
          </div>

          <BusinessProgress
            value={score}
            showValue={false}
          />

          <small>
            {getScoreMessage(score)}
          </small>
        </div>
        </ComingSoonOverlay>

      </div>
    </BusinessCard>
  );
}

function getScoreMessage(score) {
  if (score >= 90) {
    return "Votre proposition de valeur est très claire et fortement différenciante.";
  }

  if (score >= 75) {
    return "Votre proposition de valeur est claire, mais peut encore être davantage différenciée.";
  }

  if (score >= 50) {
    return "Votre proposition de valeur est définie, mais plusieurs éléments méritent d'être clarifiés.";
  }

  return "Votre proposition de valeur nécessite encore un travail de clarification.";
}

export default BusinessProfileValue;