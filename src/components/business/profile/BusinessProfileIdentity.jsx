import BusinessCard from "../BusinessCard";

function BusinessProfileIdentity({
  profile,
  onEdit,
}) {
  return (
    <BusinessCard
      title="Identité de l'entreprise"
      subtitle="Les informations fondamentales de votre activité."
      action={
        <button
          className="business-edit-button"
          onClick={onEdit}
        >
          Modifier
        </button>
      }
    >
      <div className="profile-identity">

        <div className="profile-company-avatar">
          {profile.companyName
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-company-info">

          <h2>{profile.companyName}</h2>

          <div className="profile-company-meta">
            <span>{profile.sector}</span>
            <span>•</span>
            <span>{profile.location}</span>
          </div>

          <div className="profile-company-status">
            <span className="profile-status-dot" />
            {profile.stage}
          </div>

        </div>

      </div>

      <div className="profile-description">
        <span>Description</span>

        <p>
          {profile.description ||
            "Aucune description renseignée."}
        </p>
      </div>
    </BusinessCard>
  );
}

export default BusinessProfileIdentity;