import useScrollReveal from "../../hooks/useScrollReveal";

const problems = [
  {
    title: "Clarté",
    text: "Ils ne savent pas exactement quoi vendre, à qui, ni pourquoi eux.",
  },
  {
    title: "Visibilité",
    text: "Site faible, référencement absent, communication irrégulière.",
  },
  {
    title: "Acquisition",
    text: "Ils dépendent du bouche-à-oreille et des opportunités ponctuelles.",
  },
  {
    title: "Structuration",
    text: "Tout repose sur le fondateur : pas de CRM, pas de suivi, pas de process.",
  },
  {
    title: "Technologie",
    text: "Peu d'automatisation, peu d'IA, peu d'outils réellement exploités.",
  },
  {
    title: "Progression",
    text: "Pas de mentor, pas de méthode, pas de communauté pour avancer.",
  },
];

function ProblemSection() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="ecosysteme" className="lp-section lp-section-light" ref={ref}>
      <div className={`lp-section-inner ${visible ? "lp-visible" : ""}`}>
        <span className="lp-eyebrow lp-eyebrow-dark">Le vrai problème</span>
        <h2 className="lp-h2">Ce n&apos;est pas un problème de motivation.</h2>
        <p className="lp-lead">
          C&apos;est un problème de clarté, de visibilité et de structure.
        </p>

        <div className="lp-problem-grid">
          {problems.map((p) => (
            <div className="lp-problem-card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
