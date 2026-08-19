import BusinessCard from "../BusinessCard";

function BusinessProfileStrategy({
  profile,
  onEdit,
}) {
  return (
    <BusinessCard
      title="Vision & Mission"
      subtitle="Pourquoi votre entreprise existe et où elle veut aller."
      action={
        <button
          className="business-edit-button"
          onClick={onEdit}
        >
          Modifier
        </button>
      }
    >
      <div className="profile-strategy-grid">

        <StrategyBlock
          label="Vision"
          value={profile.vision}
        />

        <StrategyBlock
          label="Mission"
          value={profile.mission}
        />

        <StrategyBlock
          label="Ambition"
          value={profile.ambition}
        />

      </div>
    </BusinessCard>
  );
}

function StrategyBlock({
  label,
  value,
}) {
  return (
    <div className="profile-strategy-block">

      <span>{label}</span>

      <p>
        {value ||
          "Cette information n'est pas encore définie."}
      </p>

    </div>
  );
}

export default BusinessProfileStrategy;