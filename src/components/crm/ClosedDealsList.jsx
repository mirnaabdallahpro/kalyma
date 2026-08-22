function formatAmount(amount, currency) {
  if (amount === null || amount === undefined) return "—";
  return `${Number(amount).toLocaleString("fr-FR")} ${currency || "MAD"}`;
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ClosedDealsList({ deals, variant }) {
  const label = variant === "gagne" ? "gagnée" : "perdue";

  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Opportunités {variant === "gagne" ? "gagnées" : "perdues"}</h3>
        <span className="muted">
          {deals.length} opportunité{deals.length > 1 ? "s" : ""}
        </span>
      </div>

      {deals.length === 0 ? (
        <p className="empty-state">Aucune opportunité {label} pour le moment.</p>
      ) : (
        <div className="closed-list">
          {deals.map((d) => (
            <div className="closed-row" key={d.id}>
              <div>
                <strong>{d.companyName}</strong>
                <small>
                  {d.offer?.name || "Offre inconnue"} · {formatAmount(d.amount, d.currency)}
                </small>
                {variant === "perdu" && d.lostReason && (
                  <small className="closed-reason">Raison : {d.lostReason}</small>
                )}
              </div>
              <span className="muted">{formatDate(d.closedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ClosedDealsList;
