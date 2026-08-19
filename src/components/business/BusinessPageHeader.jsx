function BusinessPageHeader({
  title,
  description,
  meta,
  action,
}) {
  return (
    <div className="business-page-header">
      <div>
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      <div className="business-page-header-right">
        {meta && (
          <span className="business-page-meta">
            {meta}
          </span>
        )}

        {action}
      </div>
    </div>
  );
}

export default BusinessPageHeader;