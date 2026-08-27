import { useState } from "react";

function formatAmount(amount, currency) {
  if (amount === null || amount === undefined) return "";
  return `${Number(amount).toLocaleString("fr-FR")} ${currency || "MAD"}`;
}

function DealCard({ deal, dragging, onDragStart, onDragEnd, onDropBefore, onEdit, onDelete, onWon, onLost, onQualify , onScheduleMeeting }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`deal-card-wrap ${dragOver ? "task-drop-before" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        onDropBefore(deal.id);
      }}
    >
      <div
        className={`deal-card ${dragging ? "task-dragging" : ""}`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", deal.id);
          e.dataTransfer.effectAllowed = "move";
          onDragStart(deal.id);
        }}
        onDragEnd={onDragEnd}
      >
        <div className="deal-card-top">
          <strong>{deal.companyName}</strong>

          <div
  className="row-menu"
  onMouseDown={(e) => e.stopPropagation()}
>
  <button
    type="button"
    className="icon-btn"
    onClick={(e) => {
      e.stopPropagation();
      setMenuOpen((v) => !v);
    }}
    aria-label="Options"
  >
    ⋮
  </button>

  {menuOpen && (
    <div className="row-dropdown">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(false);
          onEdit(deal);
        }}
      >
        Modifier
      </button>

      <button
        type="button"
        className="danger"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(false);
          onDelete(deal);
        }}
      >
        Supprimer
      </button>
    </div>
  )}
</div>
        </div>

        <span className="deal-amount">{formatAmount(deal.amount, deal.currency)}</span>

        {deal.offer && <span className="deal-offer">{deal.offer.name}</span>}

        {deal.source && <span className="deal-source">{deal.source}</span>}

        {(deal.stage === "qualification" || deal.stage === "nurturing") && (
          <div className="qualif-badges">
            <span className={deal.qualificationBesoin ? "qb-on" : "qb-off"}>Besoin</span>
            <span className={deal.qualificationBudget ? "qb-on" : "qb-off"}>Budget</span>
            <span className={deal.qualificationTiming ? "qb-on" : "qb-off"}>Timing</span>
            <span className={deal.qualificationAuthority ? "qb-on" : "qb-off"}>Autorité</span>
          </div>
        )}

        {deal.stage === "qualification" && (
          <button
            type="button"
            className="deal-quick-btn deal-quick-qualify"
            onClick={() => onQualify(deal)}
          >
            Qualifier
          </button>
        )}
                {deal.stage === "rdv" && (
          <button
            type="button"
            className="deal-quick-btn deal-quick-meeting"
            onClick={() => onScheduleMeeting(deal)}
          >
            📅 Programmer un RDV
          </button>
        )}


        <div className="deal-quick-actions">
          <button
            type="button"
            className="deal-quick-btn deal-quick-won"
            onClick={() => onWon(deal)}
            title="Marquer comme client signé"
          >
            ✓ Closé
          </button>
          <button
            type="button"
            className="deal-quick-btn deal-quick-lost"
            onClick={() => onLost(deal)}
            title="Marquer perdu"
          >
            ✕ Perdu
          </button>
        </div>
      </div>
    </div>
  );
}

export default DealCard;