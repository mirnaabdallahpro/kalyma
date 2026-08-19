function BusinessStatusBadge({
  status = "neutral",
  children,
}) {
  return (
    <span className={`business-status ${status}`}>
      {children}
    </span>
  );
}

export default BusinessStatusBadge;