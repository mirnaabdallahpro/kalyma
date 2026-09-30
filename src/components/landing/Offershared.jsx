import { useEffect } from "react";

// TODO : remplace par ton vrai lien Calendly (un seul event type pour toutes les offres)
export const CALENDLY_URL = "https://calendly.com/kalyma/appel-de-cadrage-le-signal";

// Couleurs Kalyma appliquées à l'intérieur du widget Calendly
// (les 3 seuls paramètres que Calendly autorise à personnaliser,
// sans le # devant le code hexadécimal)
const CALENDLY_COLORS = {
  primary_color: "f4b740", // jaune Kalyma — boutons et créneaux sélectionnés
  text_color: "1c2431", // navy Kalyma — texte du widget
  background_color: "ffffff", // fond du widget
};

// Charge le script + le CSS Calendly une seule fois, quel que soit
// le nombre de sections qui l'utilisent sur la page.
export function useCalendlyScript() {
  useEffect(() => {
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    if (!window.Calendly && !document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
}

// On passe le nom de l'offre en utm_content : tu verras dans Calendly
// (et dans les emails de confirmation) quelle offre a motivé la prise de RDV.
export function openCalendlyPopup(offerName) {
  if (window.Calendly) {
    const params = new URLSearchParams({
      utm_content: offerName,
      ...CALENDLY_COLORS,
    });
    window.Calendly.initPopupWidget({
      url: `${CALENDLY_URL}?${params.toString()}`,
    });
  }
}

export function OfferDetailCard({ offer }) {
  return (
    <div className={`lp-offer-detail ${offer.featured ? "lp-offer-detail-featured" : ""}`}>
      <span className="lp-offer-tag">{offer.tag}</span>
      <h3 className="lp-offer-detail-name">{offer.name}</h3>
      <p className="lp-offer-detail-promise">{offer.promise}</p>

      <div className="lp-offer-meta-row">
        {offer.meta.map((m) => (
          <div className="lp-offer-meta-item" key={m.label}>
            <strong>{m.label}</strong>
            <span>{m.value}</span>
          </div>
        ))}
      </div>

      <p className="lp-offer-section-label">Ce que vous obtenez concrètement</p>
      <ul className="lp-offer-checklist">
        {offer.deliverables.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>

      <div className="lp-offer-stack">
        <p className="lp-offer-stack-title">Ce que ça vaut réellement</p>
        {offer.stack.map((s) => (
          <div className="lp-offer-stack-row" key={s.label}>
            <span>{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
        <div className="lp-offer-stack-total">
          <span>Valeur totale</span>
          <span>{offer.stackTotal}</span>
        </div>
      </div>

      <div className="lp-offer-price-block">
        <div className="lp-offer-price-from">{offer.priceFrom}</div>
        <div className="lp-offer-price-value">
          {offer.price} <small>{offer.priceUnit}</small>
        </div>
      </div>

      <div className="lp-offer-guarantee">
        <b>{offer.guaranteeTitle} : </b>
        {offer.guaranteeText}
      </div>

      <div className="lp-offer-bonus-scarcity">
        <div>
          <b>Bonus inclus</b>
          {offer.bonus}
        </div>
        <div>
          <b>Places</b>
          {offer.scarcity}
        </div>
      </div>

      <button
        type="button"
        onClick={() => openCalendlyPopup(offer.name)}
        className={`btn ${offer.featured ? "btn-yellow" : "btn-ghost-light"}`}
      >
        Choisir {offer.name}
      </button>
    </div>
  );
}