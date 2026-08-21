import Panel from "../dashboard/Panel";

function ProgressPanel({ percent, done, total }) {
  return (
    <Panel title="Progression" subtitle="Cette semaine">
      <div className="score">{percent}%</div>
      <div className="progress">
        <i style={{ width: `${percent}%` }} />
      </div>
      <p className="muted" style={{ marginTop: 12 }}>
        {done} tâche{done > 1 ? "s" : ""} terminée{done > 1 ? "s" : ""} sur{" "}
        {total}
      </p>
    </Panel>
  );
}

export default ProgressPanel;
