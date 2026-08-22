function ComingSoonOverlay({ children, message = "Cette fonctionnalité est en cours de développement." }) {
  return (
    <div className="coming-soon-wrapper">
      <div className="coming-soon-content">
        {children}
      </div>

      <div className="coming-soon-overlay">
        <div className="coming-soon-message">
          <span className="coming-soon-icon">🔒</span>

          <strong>Fonctionnalité en préparation</strong>

          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonOverlay;