import DealCard from "./DealCard";

const STAGE_LABEL = {
  lead: "Lead",
  qualification: "Qualification",
  nurturing: "Nurturing",
  rdv: "RDV",
};

function DealColumn({
  stage,
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
  return (
    <div
      className={`stage deal-column ${stage === "nurturing" ? "stage-nurturing" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropEnd();
      }}
    >
      <h4>
        {STAGE_LABEL[stage]} · {deals.length}
      </h4>

      <div className="deal-column-list">
        {deals.length === 0 && <p className="task-column-empty">Vide</p>}

        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            dragging={draggingId === deal.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropBefore={onDropBefore}
            onEdit={onEdit}
            onDelete={onDelete}
            onWon={onWon}
            onLost={onLost}
            onQualify={onQualify}
          />
        ))}
      </div>
    </div>
  );
}

export default DealColumn;