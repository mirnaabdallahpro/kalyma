import Panel from "../dashboard/Panel";
import OfferCard from "./OfferCard";

function OffersPanel({ offers, onAdd, onEdit, onDelete }) {
  return (
    <Panel
      title="Offres"
      subtitle={`${offers.length} offre${offers.length > 1 ? "s" : ""}`}
    >
      {offers.length === 0 ? (
        <p className="empty-state">
          Aucune offre pour le moment. Ajoutez votre première offre pour
          structurer votre proposition commerciale.
        </p>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn btn-yellow"
        style={{ marginTop: 16 }}
        onClick={onAdd}
      >
        + Ajouter une offre
      </button>
    </Panel>
  );
}

export default OffersPanel;
