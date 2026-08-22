function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function bucketFor(scheduledAt) {
  const now = new Date();
  const date = new Date(scheduledAt);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (startOfDate < startOfToday) return "late";
  if (startOfDate.getTime() === startOfToday.getTime()) return "today";
  return "upcoming";
}

const BUCKET_LABEL = {
  late: "En retard",
  today: "Aujourd'hui",
  upcoming: "À venir",
};

function RelancesPanel({ relances, onComplete, onSkip, onOpenSettings }) {
  const buckets = { late: [], today: [], upcoming: [] };
  relances.forEach((r) => buckets[bucketFor(r.scheduledAt)].push(r));

  return (
    <section className="panel" style={{ marginTop: 18 }}>
      <div className="panel-head">
        <h3>Relances</h3>
        <button type="button" className="btn btn-ghost btn-small" onClick={onOpenSettings}>
          Configurer
        </button>
      </div>

      {relances.length === 0 ? (
        <p className="empty-state">Aucune relance en attente.</p>
      ) : (
        ["late", "today", "upcoming"].map((key) =>
          buckets[key].length === 0 ? null : (
            <div className="relance-bucket" key={key}>
              <h4 className={`relance-bucket-label relance-${key}`}>
                {BUCKET_LABEL[key]} · {buckets[key].length}
              </h4>

              {buckets[key].map((r) => (
                <div className="relance-row" key={r.id}>
                  <div>
                    <strong>{r.companyName || "Prospect"}</strong>
                    <small>
                      J+{r.dayOffset} · {formatDate(r.scheduledAt)}
                    </small>
                  </div>

                  <div className="relance-actions">
                    <button type="button" onClick={() => onComplete(r.id)}>
                      Fait
                    </button>
                    <button type="button" className="danger" onClick={() => onSkip(r.id)}>
                      Ignorer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )
      )}
    </section>
  );
}

export default RelancesPanel;
