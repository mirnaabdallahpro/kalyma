import { Link } from "react-router-dom";

function FinalCTA() {
  return (
    <section className="lp-final-cta">
      <div className="lp-section-inner">
        <h2>Prêt à structurer votre croissance ?</h2>
        <p>Un premier échange suffit pour savoir où concentrer vos efforts.</p>

        <div className="lp-hero-cta">
          <a href="#offres" className="btn btn-yellow">
            Faire mon diagnostic gratuit
          </a>
          <Link to="/dashboard" className="lp-hero-secondary">
            Se connecter à mon espace →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
