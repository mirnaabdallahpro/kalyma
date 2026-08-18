function BusinessAIDiagnostic({ insight, onSeeAnalysis }) {
  return (
    <section className="ai" style={{ marginTop: 18 }}>
      <span className="tag">KALYMA AI</span>
      <h3>Diagnostic stratégique</h3>
      <p>{insight}</p>
      <button type="button" onClick={onSeeAnalysis}>
        Voir l&apos;analyse →
      </button>
    </section>
  );
}

export default BusinessAIDiagnostic;
