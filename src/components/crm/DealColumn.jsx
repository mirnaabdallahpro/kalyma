import DealCard from "./DealCard";

const STAGE_LABEL = {
  lead: "Lead",
  rdv: "RDV",
  proposition: "Proposition",
  negociation: "Négociation",
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
}) {
  return (
    <div
      className="stage deal-column"
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
          />
        ))}
      </div>
    </div>
  );
}

export default DealColumn;
