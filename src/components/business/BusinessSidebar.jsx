import { useState } from "react";
import { NavLink } from "react-router-dom";

function BusinessSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menu = [
    {
      label: "Vue d'ensemble",
      path: "/business",
      icon: "◈",
      end: true,
    },
    {
      label: "Profil Business",
      path: "/business/profile",
      icon: "◎",
    },
    {
      label: "Stratégie",
      path: "/business/strategy",
      icon: "◇",
    },
    {
      label: "Offres",
      path: "/business/offers",
      icon: "▣",
    },
    {
      label: "Objectifs",
      path: "/business/goals",
      icon: "✓",
    },
    {
      label: "KPIs",
      path: "/business/kpis",
      icon: "◒",
    },
    {
      label: "Diagnostics",
      path: "/business/diagnostics",
      icon: "✦",
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* =========================================
          DESKTOP SIDEBAR
      ========================================= */}

      <aside className="business-sidebar">

        <div className="business-sidebar-header">
          <span>BUSINESS</span>

          <strong>
            Cockpit stratégique
          </strong>
        </div>

        <nav className="business-sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `business-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="business-sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="business-sidebar-footer">
          <div className="business-sidebar-ai">
            <span>✦</span>

            <div>
              <strong>Kalyma AI</strong>

              <small>
                Assistant stratégique
              </small>
            </div>
          </div>
        </div>

      </aside>


      {/* =========================================
          MOBILE BUSINESS NAVIGATION
      ========================================= */}

      <div className="business-mobile-navigation">

        <button
          type="button"
          className="business-mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen((prev) => !prev)
          }
          aria-expanded={mobileMenuOpen}
          aria-label="Ouvrir le menu Business"
        >
          <div className="business-mobile-title">

            <span className="business-mobile-icon">
              ◉
            </span>

            <div>
              <span>BUSINESS</span>

              <strong>
                Cockpit stratégique
              </strong>
            </div>

          </div>

          <span className="business-mobile-chevron">
            {mobileMenuOpen ? "⌃" : "⌄"}
          </span>
        </button>


        {/* MENU */}
        {mobileMenuOpen && (
          <div className="business-mobile-menu">

            <div className="business-mobile-menu-header">
              <span>
                NAVIGATION BUSINESS
              </span>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Fermer le menu"
              >
                ×
              </button>
            </div>

            <nav>
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `business-mobile-link ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <span className="business-mobile-link-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>

                  <span className="business-mobile-link-arrow">
                    →
                  </span>
                </NavLink>
              ))}
            </nav>

            {/* IA */}
            <div className="business-mobile-ai">
              <span>✦</span>

              <div>
                <strong>
                  Kalyma AI
                </strong>

                <small>
                  Assistant stratégique
                </small>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default BusinessSidebar;