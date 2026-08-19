function BusinessStatCard({
  label,
  value,
  trend,
  trendType = "neutral",
  description,
}) {
  return (
    <div className="business-stat-card">
      <div className="business-stat-label">
        {label}
      </div>

      <div className="business-stat-value">
        {value}
      </div>

      {trend && (
        <div className={`business-stat-trend ${trendType}`}>
          {trend}
        </div>
      )}

      {description && (
        <div className="business-stat-description">
          {description}
        </div>
      )}
    </div>
  );
}

export default BusinessStatCard;