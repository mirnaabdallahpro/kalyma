import Panel from "../dashboard/Panel";
import GoalRow from "./GoalRow";

function GoalsPanel({ goals, onAdd, onEdit, onDelete }) {
  return (
    <Panel title="Objectifs stratégiques" subtitle="2026">
      {goals.length === 0 ? (
        <p className="empty-state">
          Aucun objectif défini. Ajoutez votre premier objectif stratégique.
        </p>
      ) : (
        goals.map((goal) => (
          <GoalRow
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}

      <button
        type="button"
        className="btn btn-ghost btn-block"
        style={{ marginTop: 14 }}
        onClick={onAdd}
      >
        + Ajouter un objectif
      </button>
    </Panel>
  );
}

export default GoalsPanel;
