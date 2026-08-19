import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-pattern" aria-hidden="true" />

      <div className="lp-hero-inner">
        <span className="lp-eyebrow">
          Growth Partner — Entrepreneurs subsahariens au Maroc
        </span>

        <h1 className="lp-hero-title">
          Votre talent suffit.
          <br />
          Votre structure, <em>pas encore</em>.
        </h1>

        <p className="lp-hero-sub">
          Kalyma accompagne les entrepreneurs et professionnels subsahariens
          installés au Maroc dans la structuration, la visibilité et la
          croissance de leur activité — par la stratégie, le digital et la
          technologie.
        </p>

        <div className="lp-hero-cta">
          <a href="#offres" className="btn btn-yellow">
            Faire mon diagnostic gratuit
          </a>
          <Link to="/dashboard" className="lp-hero-secondary">
            Se connecter →
          </Link>
        </div>
      </div>

      <div className="lp-stat-strip">
        <span>
          148&nbsp;152 résidents étrangers au Maroc{" "}
          <em>(+76&nbsp;% depuis 2014)</em>
        </span>
        <span>59,9&nbsp;% originaires d&apos;Afrique subsaharienne</span>
        <span>95&nbsp;235 entreprises créées en 2024</span>
      </div>
    </section>
  );
}

export default Hero;
