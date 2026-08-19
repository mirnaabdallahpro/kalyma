function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-section-inner lp-footer-inner">
        <div>
          <div className="lp-logo lp-footer-logo">
            kaly<span>ma</span>
          </div>
          <p>Business. Digital. Technologie. Accompagnement.</p>
        </div>

        <nav className="lp-footer-links">
          <a href="#ecosysteme">Écosystème</a>
          <a href="#parcours">Parcours</a>
          <a href="#offres">Offres</a>
          <a href="#pourquoi">Pourquoi nous</a>
        </nav>

        <div className="lp-footer-meta">
          <span>© {new Date().getFullYear()} Kalyma</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
