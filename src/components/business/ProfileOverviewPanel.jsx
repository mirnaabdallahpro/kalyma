import Panel from "../dashboard/Panel";

function ProfileOverviewPanel({ profile, onEdit }) {
  const metrics = [
    {
      label: "Positionnement",
      value: profile.positioning || "À définir",
      trend: profile.positioning ? "✓ Défini" : "À compléter",
      up: Boolean(profile.positioning),
    },
    {
      label: "ICP",
      value: profile.icp || "À définir",
      trend: profile.icp ? "✓ Défini" : "À compléter",
      up: Boolean(profile.icp),
    },
    {
      label: "Proposition de valeur",
      value: `${profile.valuePropositionScore}%`,
      trend: profile.valuePropositionScore >= 90 ? "✓ Optimisée" : "À optimiser",
      up: profile.valuePropositionScore >= 90,
    },
    {
      label: "Offres",
      value: String(profile.offersCount),
      trend: profile.offersCount > 0 ? "✓ Structurées" : "À créer",
      up: profile.offersCount > 0,
    },
  ];

  return (
    <Panel title="Profil business" subtitle={`Complété à ${profile.completion}%`}>
      <div className="metric-grid" style={{ marginTop: 0 }}>
        {metrics.map((m) => (
          <div className="d-card" key={m.label}>
            <div className="label">{m.label}</div>
            <div className="value" style={{ fontSize: 18 }}>
              {m.value}
            </div>
            <div className={`trend ${m.up ? "up" : ""}`}>{m.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Proposition de valeur</h3>
        <p style={{ lineHeight: 1.7, color: "var(--muted)" }}>
          {profile.valueProposition || "Aucune proposition de valeur définie pour le moment."}
        </p>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 10 }}
        onClick={onEdit}
      >
        Modifier le profil
      </button>
    </Panel>
  );
}

export default ProfileOverviewPanel;
