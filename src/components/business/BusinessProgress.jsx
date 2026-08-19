function BusinessProgress({
  value = 0,
  label,
  showValue = true,
}) {
  return (
    <div className="business-progress-wrapper">
      {label && (
        <div className="business-progress-header">
          <span>{label}</span>

          {showValue && (
            <strong>{value}%</strong>
          )}
        </div>
      )}

      <div className="business-progress">
        <div
          className="business-progress-bar"
          style={{
            width: `${Math.min(value, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default BusinessProgress;