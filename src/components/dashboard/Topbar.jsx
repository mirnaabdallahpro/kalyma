import { useState } from "react";
import { NavLink } from "react-router-dom";

function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="topbar">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="search">
          ⌕ &nbsp; Rechercher...
        </div>

        <div className="user">
          <span>
            Mon espace
          </span>

          <div className="avatar">
            FA
          </div>
        </div>

      </header>

      {menuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={closeMenu}
          />

          <aside className="mobile-menu">

            <div className="mobile-menu-header">
              <NavLink
                className="logo"
                to="/dashboard"
                onClick={closeMenu}
              >
                kaly<span>ma</span>
              </NavLink>

              <button
                type="button"
                className="mobile-menu-close"
                onClick={closeMenu}
              >
                ×
              </button>
            </div>

            <div className="menu-label">
              Workspace
            </div>

            <nav className="menu">

              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ◈ &nbsp; Dashboard
              </NavLink>

              <NavLink
                to="/business"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ◉ &nbsp; Business
              </NavLink>

              <NavLink
                to="/crm"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ◎ &nbsp; CRM
              </NavLink>

              <NavLink
                to="/tasks"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ✓ &nbsp; Tâches
              </NavLink>

              <NavLink
                to="/meetings"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ▣ &nbsp; Rendez-vous
              </NavLink>

              <NavLink
                to="/messages"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ✉ &nbsp; Messages
              </NavLink>

              <NavLink
                to="/documents"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                □ &nbsp; Documents
              </NavLink>

            </nav>

            <div className="menu-label">
              Compte
            </div>

            <nav className="menu">

              <NavLink
                to="/settings"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                ⚙ &nbsp; Paramètres
              </NavLink>

            </nav>

          </aside>
        </>
      )}
    </>
  );
}

export default Topbar;