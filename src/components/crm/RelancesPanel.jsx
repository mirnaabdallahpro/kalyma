import { useMemo, useState } from "react";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function bucketFor(scheduledAt) {
  const now = new Date();
  const date = new Date(scheduledAt);

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (startOfDate < startOfToday) return "late";
  if (startOfDate.getTime() === startOfToday.getTime()) return "today";

  return "upcoming";
}

const BUCKET_LABEL = {
  late: "En retard",
  today: "Aujourd'hui",
  upcoming: "À venir",
};

const PAGE_SIZE = 10;


/**
 * Une ligne de relance réutilisable
 */
function RelanceRow({ relance, onComplete, onSkip }) {
  return (
    <div className="relance-row">
      <div>
        <strong>{relance.companyName || "Prospect"}</strong>

        <small>
          J+{relance.dayOffset} · {formatDate(relance.scheduledAt)}
        </small>
      </div>

      <div className="relance-actions">
        <button
          type="button"
          onClick={() => onComplete(relance.id)}
        >
          Fait
        </button>

        <button
          type="button"
          className="danger"
          onClick={() => onSkip(relance.id)}
        >
          Ignorer
        </button>
      </div>
    </div>
  );
}


/**
 * Modal : toutes les relances
 */
function RelancesModal({
  relances,
  onClose,
  onComplete,
  onSkip,
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleRelances = relances.slice(0, visibleCount);

  const hasMore = visibleCount < relances.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, relances.length)
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal relances-modal">

        {/* Header */}
        <div className="modal-head">
          <div>
            <h3>Toutes les relances</h3>

            <small>
              {visibleRelances.length} / {relances.length} affichées
            </small>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>


        {/* Contenu */}
        <div className="modal-body">

          {visibleRelances.length === 0 ? (
            <p className="empty-state">
              Aucune relance en attente.
            </p>
          ) : (
            <>
              {visibleRelances.map((relance) => (
                <RelanceRow
                  key={relance.id}
                  relance={relance}
                  onComplete={onComplete}
                  onSkip={onSkip}
                />
              ))}

              {/* Load more */}
              {hasMore && (
                <div className="load-more-container">
                  <button
                    type="button"
                    className="btn btn-ghost load-more-btn"
                    onClick={handleLoadMore}
                  >
                    Charger plus
                  </button>
                </div>
              )}

              {!hasMore && relances.length > PAGE_SIZE && (
                <div className="load-more-end">
                  Toutes les relances sont affichées.
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}


/**
 * Panel principal
 */
function RelancesPanel({
  relances,
  onComplete,
  onSkip,
  onOpenSettings,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * On ne garde que les 10 premières relances
   * dans le panneau principal.
   */
  const displayedRelances = relances.slice(0, PAGE_SIZE);

  /**
   * Buckets uniquement pour les 10 relances affichées
   */
  const buckets = useMemo(() => {
    const result = {
      late: [],
      today: [],
      upcoming: [],
    };

    displayedRelances.forEach((r) => {
      result[bucketFor(r.scheduledAt)].push(r);
    });

    return result;
  }, [displayedRelances]);


  return (
    <>
      <section
        className="panel"
        style={{ marginTop: 18 }}
      >

        {/* Header */}
        <div className="panel-head">

          <div>
            <h3>Relances</h3>

            {relances.length > 0 && (
              <small>
                {Math.min(relances.length, PAGE_SIZE)} sur{" "}
                {relances.length}
              </small>
            )}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={onOpenSettings}
          >
            Configurer
          </button>

        </div>


        {/* Liste */}
        {relances.length === 0 ? (
          <p className="empty-state">
            Aucune relance en attente.
          </p>
        ) : (
          <>
            {["late", "today", "upcoming"].map((key) =>
              buckets[key].length === 0 ? null : (
                <div
                  className="relance-bucket"
                  key={key}
                >

                  <h4
                    className={`relance-bucket-label relance-${key}`}
                  >
                    {BUCKET_LABEL[key]} ·{" "}
                    {buckets[key].length}
                  </h4>

                  {buckets[key].map((r) => (
                    <RelanceRow
                      key={r.id}
                      relance={r}
                      onComplete={onComplete}
                      onSkip={onSkip}
                    />
                  ))}

                </div>
              )
            )}

            {/* Voir toutes */}
            {relances.length > PAGE_SIZE && (
              <div className="relances-footer">

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(true)}
                >
                  Voir toutes les relances
                  <span className="relances-count">
                    ({relances.length})
                  </span>
                </button>

              </div>
            )}
          </>
        )}

      </section>


      {/* Modal */}
      {isModalOpen && (
        <RelancesModal
          relances={relances}
          onClose={() => setIsModalOpen(false)}
          onComplete={onComplete}
          onSkip={onSkip}
        />
      )}
    </>
  );
}

export default RelancesPanel;