function BusinessAIDiagnostic({ insight, onSeeAnalysis }) {
  return (
    <section
      className="ai ai-disabled"
      style={{
        marginTop: 18,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Contenu censuré */}
      <div className="ai-content-blurred">
        <span className="tag">KALYMA AI</span>

        <h3>Diagnostic stratégique</h3>

        <p>
          {insight ||
            "Analyse stratégique personnalisée de votre activité..."}
        </p>

        <button type="button" disabled>
          Voir l&apos;analyse →
        </button>
      </div>

      {/* Overlay */}
      <div className="ai-coming-soon">
        <div className="ai-coming-soon-content">
          <span className="ai-lock-icon">🔒</span>

          <strong>Analyse bientôt disponible</strong>

          <span>
            Le diagnostic stratégique par KALYMA AI est actuellement
            en cours de développement.
          </span>
        </div>
      </div>
    </section>
  );
}

export default BusinessAIDiagnostic;
