import DealColumn from "./DealColumn";

const STAGES = ["lead", "qualification", "nurturing", "rdv"];

function formatAmount(amount) {
  return `${Number(amount || 0).toLocaleString("fr-FR")} MAD`;
}

function PipelineBoard({
  deals,
  draggingId,
  onDragStart,
  onDragEnd,
  onDropBefore,
  onDropEnd,
  onEdit,
  onDelete,
  onWon,
  onLost,
  onQualify,
}) {
  const totalValue = deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Pipeline commercial</h3>
        <span className="muted">
          {formatAmount(totalValue)} · {deals.length} opportunité{deals.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="pipeline">
        {STAGES.map((stage) => (
          <DealColumn
            key={stage}
            stage={stage}
            deals={deals.filter((d) => d.stage === stage)}
            draggingId={draggingId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropBefore={(beforeId) => onDropBefore(beforeId, stage)}
            onDropEnd={() => onDropEnd(stage)}
            onEdit={onEdit}
            onDelete={onDelete}
            onWon={onWon}
            onLost={onLost}
            onQualify={onQualify}
          />
        ))}
      </div>
    </section>
  );
}

export default PipelineBoard;