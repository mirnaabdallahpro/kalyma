function UpcomingMeeting() {
  return (
    <section
      className="panel"
      style={{
        marginTop: "18px",
      }}
    >

      <div className="panel-head">

        <h3>
          Prochain rendez-vous
        </h3>

        <span className="muted">
          Aujourd'hui
        </span>

      </div>

      <strong>
        Growth Strategy Call
      </strong>

      <p className="muted">
        15:30 · AfriTech
      </p>

      <a
        className="btn btn-primary"
        style={{
          padding: "9px 12px",
          fontSize: "12px",
        }}
        href="#"
      >
        Voir le rendez-vous
      </a>

    </section>
  );
}

export default UpcomingMeeting;