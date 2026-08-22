function StatsCards({ deals, pendingRelancesCount }) {
  const activeStages = ["lead", "rdv", "proposition", "negociation"];
  const active = deals.filter((d) => activeStages.includes(d.stage));
  const won = deals.filter((d) => d.stage === "gagne");
  const lost = deals.filter((d) => d.stage === "perdu");

  const closedCount = won.length + lost.length;
  const conversionRate = closedCount
    ? Math.round((won.length / closedCount) * 100)
    : null;

  const amounts = active.map((d) => Number(d.amount) || 0).filter((a) => a > 0);
  const avgValue = amounts.length
    ? Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length)
    : 0;

  return (
    <div className="cards" style={{ marginTop: 18 }}>
      <div className="d-card">
        <div className="label">Taux de conversion</div>
        <div className="value">
          {conversionRate === null ? "—" : `${conversionRate}%`}
        </div>
      </div>

      <div className="d-card">
        <div className="label">Valeur moyenne</div>
        <div className="value">
          {avgValue.toLocaleString("fr-FR")}{" "}
          <span style={{ fontSize: 13 }}>MAD</span>
        </div>
      </div>

      <div className="d-card">
        <div className="label">Deals gagnés</div>
        <div className="value">{won.length}</div>
      </div>

      <div className="d-card">
        <div className="label">Relances en attente</div>
        <div className="value">{pendingRelancesCount ?? 0}</div>
        <div className="trend">Aujourd&apos;hui</div>
      </div>
    </div>
  );
}

export default StatsCards;
