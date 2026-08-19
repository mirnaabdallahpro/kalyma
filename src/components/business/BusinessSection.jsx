function BusinessSection({
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="business-section">
      <div className="business-section-header">
        <div>
          <h2>{title}</h2>

          {description && (
            <p>{description}</p>
          )}
        </div>

        {action && (
          <div className="business-section-action">
            {action}
          </div>
        )}
      </div>

      {children}
    </section>
  );
}

export default BusinessSection;