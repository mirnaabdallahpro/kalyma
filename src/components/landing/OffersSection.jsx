import { useEffect } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";

// TODO : remplace ces 3 liens par tes vrais event types Calendly
// (Calendly > Event Types > "Copy link"), un lien par offre.
const CALENDLY_URLS = {
  "Le Signal": "https://calendly.com/kalyma/appel-de-cadrage-le-signal",
  "Le Sprint": "https://calendly.com/kalyma/appel-de-cadrage-le-signal",
  "Le Partenariat": "https://calendly.com/kalyma/appel-de-cadrage-le-signal",
};

// Charge le script + le CSS Calendly une seule fois, quel que soit
// le nombre de fois où la section est montée.
function useCalendlyScript() {
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

function openCalendlyPopup(url) {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url });
  }
}

const offers = [
  {
    tag: "Offre d'entrée",
    name: "Le Signal",
    promise:
      "Savoir enfin, noir sur blanc, ce qui bloque votre croissance — et quoi faire cette semaine pour le débloquer.",
    meta: [
      { label: "Pour qui", value: "Entrepreneurs qui sentent que « quelque chose ne tourne pas » sans savoir quoi" },
      { label: "Délai", value: "Résultats livrés sous 5 jours ouvrés" },
      { label: "Effort demandé", value: "1 appel de 45 min, aucune préparation" },
    ],
    deliverables: [
      "Un diagnostic complet de votre activité sur 5 dimensions : clarté de l'offre, visibilité, acquisition, structuration, technologie",
      "Un appel de 45 minutes en visio pour creuser vos points de blocage réels",
      "Un rapport écrit avec 3 à 5 actions prioritaires, classées par impact et facilité de mise en œuvre",
      "Une réponse claire à la question : « par quoi dois-je commencer ? »",
    ],
    stack: [
      { label: "Diagnostic complet 5 dimensions", value: "1 500 MAD" },
      { label: "Session live de restitution (45 min)", value: "500 MAD" },
      { label: "Rapport écrit + plan d'action priorisé", value: "800 MAD" },
    ],
    stackTotal: "2 800 MAD",
    priceFrom: "Valeur réelle : 2 800 MAD",
    price: "990 MAD",
    priceUnit: "paiement unique",
    guaranteeTitle: "Garantie « 3 actions ou remboursé »",
    guaranteeText:
      "si à la fin du diagnostic vous n'avez pas au moins 3 actions concrètes à mettre en œuvre cette semaine, vous êtes intégralement remboursé.",
    bonus: "Accès à la checklist « 10 signaux qui montrent que votre offre n'est pas claire »",
    scarcity: "Limité à 8 diagnostics par mois pour garantir la qualité de restitution",
    featured: false,
  },
  {
    tag: "Offre cœur",
    name: "Le Sprint",
    promise:
      "Passer d'une activité qui dépend du bouche-à-oreille à une offre premium assumée, avec un système d'acquisition qui tourne sans vous.",
    meta: [
      { label: "Pour qui", value: "Entrepreneurs qui ont un client mais pas de système pour en trouver d'autres" },
      { label: "Délai", value: "6 semaines, jalons hebdomadaires" },
      { label: "Effort demandé", value: "2h/semaine, aucune compétence technique requise" },
    ],
    deliverables: [
      "Repositionnement complet de votre offre pour qu'elle devienne premium et difficile à négocier",
      "Un pricing structuré, justifiable, aligné avec votre marché",
      "Un système commercial reproductible (script de vente, gestion des objections, process de suivi)",
      "Un plan d'acquisition activé sur au moins un canal (LinkedIn, SEO ou réseau) avec le contenu de démarrage prêt à publier",
      "6 sessions hebdomadaires de suivi pour ajuster en temps réel",
    ],
    stack: [
      { label: "Repositionnement + offre premium", value: "4 000 MAD" },
      { label: "Stratégie commerciale + pricing", value: "2 500 MAD" },
      { label: "Système d'acquisition (canal + contenu de lancement)", value: "3 000 MAD" },
      { label: "6 sessions hebdomadaires de suivi", value: "3 600 MAD" },
      { label: "Accès communauté Kalyma (3 mois)", value: "900 MAD" },
      { label: "Bonus — calendrier éditorial 90 jours", value: "500 MAD" },
    ],
    stackTotal: "14 500 MAD",
    priceFrom: "Valeur réelle : 14 500 MAD",
    price: "9 900 MAD",
    priceUnit: "paiement unique",
    guaranteeTitle: "Garantie « offre validée ou on continue gratuitement »",
    guaranteeText:
      "si à l'issue des 6 semaines votre nouvelle offre n'a généré aucun prospect qualifié, nous continuons à vous accompagner gratuitement jusqu'au premier résultat.",
    bonus: "Calendrier éditorial de 90 jours + template de proposition commerciale",
    scarcity: "4 accompagnements maximum par trimestre pour un suivi réellement personnalisé",
    featured: true,
  },
  {
    tag: "Offre premium",
    name: "Le Partenariat",
    promise:
      "Ne plus porter seul la croissance de votre activité. Un partenaire qui pilote, mesure et ajuste chaque mois, pendant que vous vous concentrez sur votre métier.",
    meta: [
      { label: "Pour qui", value: "Entrepreneurs structurés qui veulent déléguer le pilotage de leur croissance" },
      { label: "Engagement", value: "Sans minimum de durée, 1er mois à l'essai" },
      { label: "Effort demandé", value: "1 point mensuel de 30 min, le reste est pris en charge" },
    ],
    deliverables: [
      "Un pilotage stratégique mensuel : priorités, ajustements, décisions business",
      "Une gestion continue de votre acquisition (contenu, prospection, suivi commercial)",
      "Un accès prioritaire à l'équipe technique pour tout besoin digital, automatisation ou IA",
      "Un tableau de bord partagé pour suivre vos indicateurs sans avoir à les compiler vous-même",
      "Un accès prioritaire au mentorat et à la communauté Kalyma",
    ],
    stack: [
      { label: "Pilotage stratégique mensuel", value: "2 000 MAD" },
      { label: "Gestion continue de l'acquisition", value: "2 500 MAD" },
      { label: "Support technique/techno prioritaire", value: "1 500 MAD" },
      { label: "Tableau de bord de suivi partagé", value: "800 MAD" },
      { label: "Accès prioritaire mentorat + communauté", value: "700 MAD" },
    ],
    stackTotal: "7 500 MAD / mois",
    priceFrom: "Valeur réelle : 7 500 MAD / mois",
    price: "4 900 MAD",
    priceUnit: "/ mois",
    guaranteeTitle: "Garantie « 1er mois sans risque »",
    guaranteeText:
      "si après le premier mois vous estimez ne pas avoir reçu la valeur annoncée, vous récupérez votre paiement intégralement, sans justification à fournir.",
    bonus: "Audit technique gratuit de votre présence digitale à l'entrée dans le programme",
    scarcity: "6 partenariats actifs maximum en simultané, pour garantir une réelle disponibilité",
    featured: false,
  },
];

function OfferDetailCard({ offer }) {
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
        onClick={() => openCalendlyPopup(CALENDLY_URLS[offer.name])}
        className={`btn ${offer.featured ? "btn-yellow" : "btn-ghost-light"}`}
      >
        Choisir {offer.name}
      </button>
    </div>
  );
}

function OffersDetailSection() {
  const [ref, visible] = useScrollReveal();
  useCalendlyScript();

  return (
    <section id="offres" className="lp-section lp-section-dark" ref={ref}>
      <div className={`lp-section-inner ${visible ? "lp-visible" : ""}`}>
        <span className="lp-eyebrow">Les offres</span>
        <h2 className="lp-h2 lp-h2-light">
          Trois façons d&apos;avancer, un seul chemin.
        </h2>
        <p className="lp-offer-note">
          Chaque offre résout un problème précis : la clarté, la structuration, ou la
          croissance continue. Pas de prestations à la carte — des transformations
          avec un point d&apos;arrivée défini.
        </p>

        <div className="lp-offers-detail-grid">
          {offers.map((o) => (
            <OfferDetailCard offer={o} key={o.name} />
          ))}
        </div>

        <p className="lp-offer-note">
          La technologie (site, automatisation, IA, SaaS) est proposée après
          diagnostic — jamais comme premier réflexe.
        </p>
      </div>
    </section>
  );
}

export default OffersDetailSection;