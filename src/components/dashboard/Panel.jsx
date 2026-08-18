function Panel({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <section
      className={`panel ${className}`}
      style={
        className === "pipeline-panel"
          ? { marginTop: "18px" }
          : undefined
      }
    >

      <div className="panel-head">

        <h3>
          {title}
        </h3>

        <span className="muted">
          {subtitle}
        </span>

      </div>

      {children}

    </section>
  );
}

export default Panel;