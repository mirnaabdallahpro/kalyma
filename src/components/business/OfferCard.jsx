import { useState } from "react";

function OfferCard({ offer, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="offer-card">
      <div className="offer-card-top">
        <span className={`badge badge-${offer.status}`}>
          {offer.status === "active" ? "Active" : "Brouillon"}
        </span>

        <div className="row-menu" tabIndex={0} onBlur={() => setMenuOpen(false)}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Options"
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="row-dropdown">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(offer);
                }}
              >
                Modifier
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(offer);
                }}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <h4>{offer.name}</h4>
      {offer.price && <div className="offer-price">{offer.price}</div>}
      <p>{offer.description}</p>
    </div>
  );
}

export default OfferCard;
