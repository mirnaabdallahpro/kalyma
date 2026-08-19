import useScrollReveal from "../../hooks/useScrollReveal";

const items = [
  {
    title: "Compréhension culturelle",
    text: "Nous sommes issus de la communauté que nous servons — nous en comprenons les codes, les réseaux et les difficultés réelles.",
  },
  {
    title: "Double compétence",
    text: "Business et technologie dans la même équipe. Peu de consultants savent construire ; peu de développeurs savent conseiller.",
  },
  {
    title: "Positionnement communautaire",
    text: "Kalyma devient progressivement une référence business pour les entrepreneurs subsahariens au Maroc.",
  },
  {
    title: "Une infrastructure, pas une prestation",
    text: "Audience, méthode, outils et partenariats : un système qui reste avec vous, pas une mission ponctuelle.",
  },
];

function DifferentiatorsSection() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="pourquoi" className="lp-section lp-section-light" ref={ref}>
      <div className={`lp-section-inner lp-diff-layout ${visible ? "lp-visible" : ""}`}>
        <div className="lp-diff-sticky">
          <span className="lp-eyebrow lp-eyebrow-dark">Pourquoi Kalyma</span>
          <h2 className="lp-h2">Pas un prestataire de plus.</h2>
        </div>

        <div className="lp-diff-list">
          {items.map((item, i) => (
            <div className="lp-diff-item" key={item.title}>
              <span className="lp-diff-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DifferentiatorsSection;
