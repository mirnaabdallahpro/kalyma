import useScrollReveal from "../../hooks/useScrollReveal";

const points = [
  { x: 40, y: 150 },
  { x: 272, y: 50 },
  { x: 504, y: 150 },
  { x: 736, y: 50 },
  { x: 968, y: 150 },
  { x: 1160, y: 50 },
];

const pathD =
  "M40,150 C120,150 192,50 272,50 " +
  "S424,150 504,150 S656,50 736,50 " +
  "S888,150 968,150 S1090,50 1160,50";

const steps = [
  {
    n: "01",
    title: "Clarté",
    text: "Comprendre ce que vous vendez, à qui, et pourquoi vous.",
  },
  {
    n: "02",
    title: "Structuration",
    text: "Poser une offre, un pricing et un modèle qui tiennent.",
  },
  {
    n: "03",
    title: "Visibilité",
    text: "Construire une présence qui inspire confiance.",
  },
  {
    n: "04",
    title: "Acquisition",
    text: "Transformer l'audience en opportunités commerciales.",
  },
  {
    n: "05",
    title: "Technologie",
    text: "Digitaliser ce qui doit l'être, pas plus.",
  },
  {
    n: "06",
    title: "Croissance",
    text: "Piloter, mesurer et accélérer dans la durée.",
  },
];

function JourneyPath() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="parcours" className="lp-section lp-section-light" ref={ref}>
      <div className={`lp-section-inner ${visible ? "lp-visible" : ""}`}>
        <span className="lp-eyebrow lp-eyebrow-dark">Le parcours</span>
        <h2 className="lp-h2">Le vrai produit, c&apos;est la transformation.</h2>

        <div className="lp-journey-svg-wrap" aria-hidden="true">
          <svg
            className={`lp-journey-svg ${visible ? "lp-journey-drawn" : ""}`}
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
          >
            <path pathLength="1" d={pathD} />
            {points.map((p) => (
              <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="6" />
            ))}
          </svg>
        </div>

        <div className="lp-journey-grid">
          {steps.map((s) => (
            <div className="lp-journey-card" key={s.n}>
              <span className="lp-journey-num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JourneyPath;
