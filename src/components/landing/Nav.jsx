import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import KalymaLogo from "../../assets/brands/kalyma-logo.svg";

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`lp-nav ${scrolled ? "lp-nav-solid" : ""}`}>
      <div className="lp-nav-inner">
        <Link to="/" className="lp-logo">
         <img src={KalymaLogo} style={{width:"250px"}} alt="Kalyma" />
        </Link>

        <nav className="lp-nav-links">
          <a href="#ecosysteme">Écosystème</a>
          <a href="#parcours">Parcours</a>
          <a href="#offres">Offres</a>
          <a href="#pourquoi">Pourquoi nous</a>
        </nav>

        <Link to="/dashboard" className="lp-nav-cta">
          Espace client →
        </Link>
      </div>
    </header>
  );
}

export default Nav;
