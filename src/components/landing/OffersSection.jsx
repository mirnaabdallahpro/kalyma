import useScrollReveal from "../../hooks/useScrollReveal";

const offers = [
  {
    tag: "Offre d'entrée",
    name: "Business Clarity Audit",
    price: "500 – 1 500 MAD",
    desc: "Un diagnostic complet de votre activité, votre marché et votre positionnement, avec une feuille de route claire.",
    featured: false,
  },
  {
    tag: "Offre cœur",
    name: "Growth Sprint",
    price: "5 000 – 15 000 MAD",
    desc: "Positionnement, offre, stratégie commerciale et acquisition structurés en profondeur sur plusieurs semaines.",
    featured: true,
  },
  {
    tag: "Offre premium",
    name: "Growth Partner",
    price: "3 000 – 8 000 MAD / mois",
    desc: "Un pilotage continu : conseil, acquisition, technologie et accompagnement dans la durée.",
    featured: false,
  },
];

function OffersSection() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="offres" className="lp-section lp-section-dark" ref={ref}>
      <div className={`lp-section-inner ${visible ? "lp-visible" : ""}`}>
        <span className="lp-eyebrow">Les offres</span>
        <h2 className="lp-h2 lp-h2-light">
          Trois façons d&apos;avancer, un seul chemin.
        </h2>

        <div className="lp-offers-grid">
          {offers.map((o) => (
            <div
              className={`lp-offer-card ${o.featured ? "lp-offer-featured" : ""}`}
              key={o.name}
            >
              <span className="lp-offer-tag">{o.tag}</span>
              <h3>{o.name}</h3>
              <div className="lp-offer-price">{o.price}</div>
              <p>{o.desc}</p>
              <a
                href="#pourquoi"
                className={`btn ${o.featured ? "btn-yellow" : "btn-ghost-light"}`}
              >
                En savoir plus
              </a>
            </div>
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

export default OffersSection;
