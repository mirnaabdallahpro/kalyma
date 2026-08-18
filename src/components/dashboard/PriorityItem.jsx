function PriorityItem({
  title,
  description,
  color,
}) {
  return (
    <div className="priority">

      <span
        className="dot"
        style={
          color
            ? {
                background:
                  color === "accent"
                    ? "var(--accent)"
                    : "var(--primary)",
              }
            : undefined
        }
      />

      <div>

        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>

      </div>

    </div>
  );
}

export default PriorityItem;