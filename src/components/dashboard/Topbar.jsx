import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../../services/authService";

const workspaceMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "◈",
  },
  {
    label: "Business",
    path: "/business",
    icon: "◉",
  },
  {
    label: "CRM",
    path: "/crm",
    icon: "◎",
  },
  {
    label: "Tâches",
    path: "/tasks",
    icon: "✓",
  },
  {
    label: "Rendez-vous",
    path: "/meetings",
    icon: "▣",
  },
  {
    label: "Messages",
    path: "/messages",
    icon: "✉",
  },
  {
    label: "Documents",
    path: "/documents",
    icon: "□",
  },
];

const accountMenu = [
  {
    label: "Paramètres",
    path: "/settings",
    icon: "⚙",
  },
];

function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  async function handleSignOut() {
    try {
      closeMenu();

      await signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion :",
        error
      );
    }
  }

  return (
    <header className="topbar">

      {/* LOGO MOBILE */}
      <NavLink
        to="/dashboard"
        className="topbar-logo"
      >
        kaly<span>ma</span>
      </NavLink>

      {/* RECHERCHE */}
      <div className="search">
        ⌕ &nbsp; Rechercher...
      </div>

      {/* ESPACE UTILISATEUR */}
      <div
        className="user-space"
        ref={menuRef}
      >
        <button
          type="button"
          className={`user ${
            menuOpen ? "open" : ""
          }`}
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span className="user-label">
            Mon espace
          </span>

          <div className="avatar">
            FA
          </div>

          <span className="user-chevron">
            {menuOpen ? "⌃" : "⌄"}
          </span>
        </button>

        {menuOpen && (
          <div className="workspace-dropdown">

            {/* HEADER */}
            <div className="workspace-dropdown-header">
              <span>MON ESPACE</span>

              <strong>
                Kalyma
              </strong>
            </div>

            {/* WORKSPACE */}
            <div className="workspace-dropdown-section">

              <div className="workspace-dropdown-label">
                Workspace
              </div>

              <nav>
                {workspaceMenu.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `workspace-dropdown-link ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <span className="workspace-dropdown-icon">
                      {item.icon}
                    </span>

                    <span>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* COMPTE */}
            <div className="workspace-dropdown-divider" />

            <div className="workspace-dropdown-section">

              <div className="workspace-dropdown-label">
                Compte
              </div>

              <nav>
                {accountMenu.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `workspace-dropdown-link ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <span className="workspace-dropdown-icon">
                      {item.icon}
                    </span>

                    <span>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* DECONNEXION */}
            <div className="workspace-dropdown-divider" />

            <button
              type="button"
              className="workspace-dropdown-logout"
              onClick={handleSignOut}
            >
              <span className="workspace-dropdown-icon">
                ↪
              </span>

              <span>
                Se déconnecter
              </span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;