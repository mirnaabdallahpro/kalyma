import useScrollReveal from "../../hooks/useScrollReveal";

function IconStrategy() {
  return (
    <svg viewBox="0 0 40 40" className="lp-pillar-icon" aria-hidden="true">
      <circle cx="20" cy="20" r="16" />
      <circle cx="20" cy="20" r="8" />
      <circle cx="20" cy="20" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconAcquisition() {
  return (
    <svg viewBox="0 0 40 40" className="lp-pillar-icon" aria-hidden="true">
      <path d="M5 30 L16 18 L23 24 L35 8" />
      <path d="M27 8 L35 8 L35 16" />
    </svg>
  );
}

function IconTech() {
  return (
    <svg viewBox="0 0 40 40" className="lp-pillar-icon" aria-hidden="true">
      <path d="M14 9 L4 20 L14 31" />
      <path d="M26 9 L36 20 L26 31" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg viewBox="0 0 40 40" className="lp-pillar-icon" aria-hidden="true">
      <circle cx="15" cy="17" r="9" />
      <circle cx="26" cy="22" r="9" />
    </svg>
  );
}

const pillars = [
  {
    Icon: IconStrategy,
    title: "Stratégie",
    desc: "Diagnostic, positionnement, offre et business model.",
  },
  {
    Icon: IconAcquisition,
    title: "Acquisition",
    desc: "LinkedIn, personal branding, SEO et système commercial.",
  },
  {
    Icon: IconTech,
    title: "Technologie",
    desc: "Présence digitale, automatisation, IA et SaaS sur mesure.",
  },
  {
    Icon: IconSupport,
    title: "Accompagnement",
    desc: "Mentorat, programmes, formation et communauté.",
  },
];

function PillarsSection() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="lp-section lp-section-dark" ref={ref}>
      <div className={`lp-section-inner ${visible ? "lp-visible" : ""}`}>
        <span className="lp-eyebrow">L&apos;écosystème</span>
        <h2 className="lp-h2 lp-h2-light">
          Une seule mission. Quatre leviers.
        </h2>

        <div className="lp-pillars-grid">
          {pillars.map(({ Icon, title, desc }) => (
            <div className="lp-pillar-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PillarsSection;
