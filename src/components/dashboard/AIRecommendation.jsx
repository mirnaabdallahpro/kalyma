function AIRecommendation({ recommendations = [], onViewPriorities }) {
  const recommendation = recommendations
    .filter((item) => !item.task_archived_at)
    .sort((a, b) => a.position - b.position)[0];

  if (!recommendation) {
    return null;
  }

  return (
    <section
      className="ai"
      style={{
        marginTop: "18px",
      }}
    >
      <span className="tag">
        KALYMA AI
      </span>

      <h3>
        {recommendation.title}
      </h3>

      <p>
        {recommendation.description}
      </p>

      <button onClick={onViewPriorities}>
        Voir mes priorités →
      </button>
    </section>
  );
}

export default AIRecommendation;