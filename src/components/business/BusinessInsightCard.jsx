import BusinessCard from "./BusinessCard";

function BusinessInsightCard({
  type = "AI",
  title,
  description,
  actionLabel = "Voir l'analyse →",
  onAction,
}) {
  return (
    <BusinessCard
      className="business-insight-card"
    >
      <div className="business-insight-tag">
        ✦ {type}
      </div>

      <h3>{title}</h3>

      <p style={{ lineHeight: 1.7, color: "var(--muted-color)" }}>{description}</p>

      <button
        className="business-insight-action"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </BusinessCard>
  );
}

export default BusinessInsightCard;