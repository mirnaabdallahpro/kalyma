import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  FileBarChart,
  LayoutDashboard,
  Lightbulb,
  Sparkles,
  Target,
  UserRound,
  X
} from "lucide-react";

function BusinessSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menu = [
    {
      label: "Vue d'ensemble",
      path: "/business",
      icon: LayoutDashboard,
      end: true,
      disabled: false,
    },
    {
      label: "Profil Business",
      path: "/business/profile",
      icon: UserRound,
      disabled: false,
    },
    {
      label: "Stratégie",
      path: "/business/strategy",
      icon: Lightbulb,
      disabled: false,
    },
    {
      label: "Offres",
      path: "/business/offers",
      icon: BriefcaseBusiness,
      disabled: false,
    },
    {
      label: "Objectifs",
      path: "/business/goals",
      icon: Target,
      disabled: false,
    },
    {
      label: "KPIs",
      path: "/business/kpis",
      icon: BarChart3,
      disabled: true,
    },
    {
      label: "Diagnostics",
      path: "/business/diagnostics",
      icon: FileBarChart,
      disabled: false,
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /*
   * =========================================
   * DESKTOP MENU ITEM
   * =========================================
   */
  const renderDesktopItem = (item) => {
    const Icon = item.icon;

    if (item.disabled) {
      return (
        <div
          key={item.path}
          className="business-sidebar-link business-sidebar-link-disabled"
          title="Cette fonctionnalité est en développement"
          aria-disabled="true"
        >
          <span className="business-sidebar-link-content">
            <span className="business-sidebar-icon">
              <Icon size={19} strokeWidth={1.8} />
            </span>

            <span>{item.label}</span>
          </span>

          <span className="business-sidebar-status">
            DEV
          </span>
        </div>
      );
    }

    return (
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
        <span className="business-sidebar-link-content">
          <span className="business-sidebar-icon">
            <Icon size={19} strokeWidth={1.8} />
          </span>

          <span>{item.label}</span>
        </span>
      </NavLink>
    );
  };

  /*
   * =========================================
   * MOBILE MENU ITEM
   * =========================================
   */
  const renderMobileItem = (item) => {
    const Icon = item.icon;

    if (item.disabled) {
      return (
        <div
          key={item.path}
          className="business-mobile-link business-mobile-link-disabled"
          title="Cette fonctionnalité est en développement"
          aria-disabled="true"
        >
          <span className="business-mobile-link-icon">
            <Icon size={20} strokeWidth={1.8} />
          </span>

          <span className="business-mobile-link-label">
            {item.label}
          </span>

          <span className="business-mobile-link-status">
            DEV
          </span>
        </div>
      );
    }

    return (
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
          <Icon size={20} strokeWidth={1.8} />
        </span>

        <span className="business-mobile-link-label">
          {item.label}
        </span>

        <span className="business-mobile-link-arrow">
          →
        </span>
      </NavLink>
    );
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
          {menu.map(renderDesktopItem)}
        </nav>

        <div className="business-sidebar-footer">
          <div className="business-sidebar-ai">
            <span>
              <Sparkles
                size={18}
                strokeWidth={1.8}
              />
            </span>

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
          aria-label={
            mobileMenuOpen
              ? "Fermer le menu Business"
              : "Ouvrir le menu Business"
          }
        >
          <div className="business-mobile-title">
            <span className="business-mobile-icon">
              <BriefcaseBusiness
                size={20}
                strokeWidth={1.8}
              />
            </span>

            <div>
              <span>BUSINESS</span>

              <strong>
                Cockpit stratégique
              </strong>
            </div>
          </div>

          <span className="business-mobile-chevron">
            {mobileMenuOpen ? (
              <ChevronUp
                size={20}
                strokeWidth={2}
              />
            ) : (
              <ChevronDown
                size={20}
                strokeWidth={2}
              />
            )}
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
                <X
                  size={20}
                  strokeWidth={2}
                />
              </button>
            </div>

            <nav>
              {menu.map(renderMobileItem)}
            </nav>

            {/* IA */}

            <div className="business-mobile-ai">
              <span>
                <Sparkles
                  size={18}
                  strokeWidth={1.8}
                />
              </span>

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