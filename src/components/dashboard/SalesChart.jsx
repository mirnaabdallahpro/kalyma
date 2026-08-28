function SalesChart({ deals = [] }) {
  const today = new Date();

  // Les 30 derniers jours
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 29);
  startDate.setHours(0, 0, 0, 0);

  // Initialiser les 30 jours à 0
  const salesByDay = {};

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const key = date.toISOString().split("T")[0];

    salesByDay[key] = 0;
  }

  // Ajouter les deals dans leur journée
  deals.forEach((deal) => {
    if (!deal.created_at) return;

    const date = new Date(deal.created_at);

    if (date < startDate || date > today) return;

    const key = date.toISOString().split("T")[0];

    if (salesByDay[key] !== undefined) {
      salesByDay[key] += Number(deal.amount || 0);
    }
  });

  const bars = Object.entries(salesByDay).map(
    ([date, amount]) => ({
      date,
      amount,
    })
  );

  const maxAmount = Math.max(
    ...bars.map((bar) => bar.amount),
    1
  );

  return (
    <div className="chart">
      {bars.map((bar) => (
        <i
          key={bar.date}
          className="bar"
          title={`${new Date(
            `${bar.date}T12:00:00`
          ).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          })} : ${bar.amount.toLocaleString(
            "fr-FR"
          )} MAD`}
          style={{
            height: `${(bar.amount / maxAmount) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export default SalesChart;