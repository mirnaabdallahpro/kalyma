function StatCard({
  label,
  value,
  suffix,
  trend,
  trendType = "default",
}) {
  return (
    <div className="d-card">

      <div className="label">
        {label}
      </div>

      <div className="value">
        {value}

        {suffix && (
          <span
            style={{
              fontSize: "14px",
              color: "#8994a8",
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      <div
        className={`trend ${
          trendType === "up" ? "up" : ""
        }`}
      >
        {trend}
      </div>

    </div>
  );
}

export default StatCard;