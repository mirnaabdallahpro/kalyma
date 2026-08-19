function BusinessEmptyState({
  icon = "＋",
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="business-empty-state">
      <div className="business-empty-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      {description && (
        <p>{description}</p>
      )}

      {actionLabel && (
        <button
          className="btn btn-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default BusinessEmptyState;