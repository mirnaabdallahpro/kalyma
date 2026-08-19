function BusinessTimelineItem({
  date,
  title,
  description,
  icon = "●",
}) {
  return (
    <div className="business-timeline-item">
      <div className="business-timeline-icon">
        {icon}
      </div>

      <div className="business-timeline-content">
        <span>{date}</span>

        <strong>{title}</strong>

        {description && (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
}

export default BusinessTimelineItem;