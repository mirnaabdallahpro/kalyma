function UpcomingMeeting({ meetings = [] }) {
  const nextMeeting =
    [...meetings]
      .filter((meeting) => meeting?.scheduledAt)
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime()
      )[0] || null;



  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date inconnue";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section
      className="panel"
      style={{
        marginTop: "18px",
      }}
    >
      <div className="panel-head">
        <h3>Prochain rendez-vous</h3>

        <span className="muted">
          {nextMeeting ? "À venir" : "Aucun"}
        </span>
      </div>

      {nextMeeting ? (
        <>
          <strong>{nextMeeting.title}</strong>

          <p className="muted">
            {formatDateTime(nextMeeting.scheduledAt)}

            {nextMeeting.prospect?.companyName &&
              ` · ${nextMeeting.prospect.companyName}`}
          </p>

          <a
            className="btn btn-primary"
            style={{
              padding: "9px 12px",
              fontSize: "12px",
            }}
            href={`/meetings`}
          >
            Voir le rendez-vous
          </a>
        </>
      ) : (
        <p className="muted">
          Aucun rendez-vous à venir.
        </p>
      )}
    </section>
  );
}

export default UpcomingMeeting;