import BusinessCard from "../BusinessCard";

function BusinessProfilePositioning({
  profile,
  onEdit,
}) {
  return (
    <BusinessCard
      title="Positionnement"
      subtitle="Comment votre entreprise se positionne sur son marché."
      action={
        <button
          className="business-edit-button"
          onClick={onEdit}
        >
          Modifier
        </button>
      }
    >

      <div className="profile-positioning-main">

        <div>
          <span className="profile-field-label">
            Positionnement
          </span>

          <h3>
            {profile.positioning}
          </h3>
        </div>

        <div>
          <span className="profile-field-label">
            Catégorie
          </span>

          <p>
            {profile.category}
          </p>
        </div>

      </div>

      <div className="profile-positioning-grid">

        <PositioningItem
          title="Problème résolu"
          value={profile.problemSolved}
        />

        <PositioningItem
          title="Différenciation"
          value={profile.differentiation}
        />

      </div>

    </BusinessCard>
  );
}

function PositioningItem({
  title,
  value,
}) {
  return (
    <div className="profile-positioning-item">
      <span>{title}</span>
      <p>{value}</p>
    </div>
  );
}

export default BusinessProfilePositioning;