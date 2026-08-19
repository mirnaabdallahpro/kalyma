function BusinessHealthCard({ score = 76 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="business-health-card">
      <div className="business-health-content">

        <div className="business-health-circle">
          <svg
            viewBox="0 0 100 100"
            className="business-health-svg"
          >
            {/* Cercle de fond */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e9edf4"
              strokeWidth="8"
            />

            {/* Progression */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#ffdc5a"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
            />
          </svg>

          <div className="business-health-score">
            <strong>{score}</strong>
            <span>/100</span>
          </div>
        </div>

        <div className="business-health-info">
          <strong>Bonne dynamique</strong>

          <p>
            Votre activité est sur une bonne dynamique.
            Quelques leviers stratégiques peuvent encore
            améliorer votre performance.
          </p>

          <button className="btn btn-secondary">
            Voir le diagnostic →
          </button>
        </div>

      </div>
    </div>
  );
}

export default BusinessHealthCard;