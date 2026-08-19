function BusinessCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <section className={`business-card ${className}`}>
      {(title || action) && (
        <div className="business-card-header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>

          {action && <div>{action}</div>}
        </div>
      )}

      <div className="business-card-body">{children}</div>
    </section>
  );
}

export default BusinessCard;