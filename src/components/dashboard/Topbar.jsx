import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { accountMenu, workspaceMenu } from "./navigation";

function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Fermer le menu lorsqu'on clique à l'extérieur
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

  return (
    <header className="topbar">
      <div className="search">
        ⌕ &nbsp; Rechercher...
      </div>

      <div
        className="user-space"
        ref={menuRef}
      >
        <button
          type="button"
          className={`user ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span>Mon espace</span>

          <div className="avatar">
            FA
          </div>

          <span className="user-chevron">
            {menuOpen ? "⌃" : "⌄"}
          </span>
        </button>

        {menuOpen && (
          <div className="workspace-dropdown">
            <div className="workspace-dropdown-header">
              <span>MON ESPACE</span>
              <strong>Kalyma</strong>
            </div>

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

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

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

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;