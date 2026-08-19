import BusinessCard from "../BusinessCard";

function BusinessProfileModel({
  profile,
  onEdit,
}) {
  return (
    <BusinessCard
      title="Business Model"
      subtitle="Comment votre entreprise génère ses revenus."
      action={
        <button
          className="business-edit-button"
          onClick={onEdit}
        >
          Modifier
        </button>
      }
    >

      <div className="profile-model-main">

        <div className="profile-model-type">

          <span className="profile-field-label">
            Modèle économique
          </span>

          <strong>
            {profile.businessModel}
          </strong>

        </div>

        <div className="profile-revenue">

          <span className="profile-field-label">
            Sources de revenus
          </span>

          <div className="profile-revenue-list">
            {profile.revenueSources.map(
              (source) => (
                <span key={source}>
                  {source}
                </span>
              )
            )}
          </div>

        </div>

      </div>

      <div className="profile-target-market">

        <span className="profile-field-label">
          Marché cible
        </span>

        <p>
          {profile.targetMarket}
        </p>

      </div>

    </BusinessCard>
  );
}

export default BusinessProfileModel;