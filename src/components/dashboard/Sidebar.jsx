import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../../services/authService";

function Sidebar() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  }

  const menuItems = [
    {
      to: "/dashboard",
      icon: "◈",
      label: "Dashboard",
      disabled: false,
    },
    {
      to: "/business",
      icon: "◉",
      label: "Business",
      disabled: false,
    },
    {
      to: "/crm",
      icon: "◎",
      label: "CRM",
      disabled: true,
    },
    {
      to: "/tasks",
      icon: "✓",
      label: "Tâches",
      disabled: false,
    },
    {
      to: "/meetings",
      icon: "▣",
      label: "Rendez-vous",
      disabled: true,
    },
    {
      to: "/messages",
      icon: "✉",
      label: "Messages",
      disabled: true,
    },
    {
      to: "/documents",
      icon: "□",
      label: "Documents",
      disabled: true,
    },
  ];

  const accountItems = [
    {
      to: "/settings",
      icon: "⚙",
      label: "Paramètres",
      disabled: true,
    },
  ];

  function renderMenuItem(item) {
    if (item.disabled) {
      return (
        <div
          key={item.to}
          className="menu-item menu-item-disabled"
          title="Cette fonctionnalité est en développement"
          aria-disabled="true"
        >
          <span className="menu-item-content">
            <span className="menu-item-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </span>

          <span className="menu-item-status">
            <span className="menu-item-status-icon">⚙</span>
          </span>
        </div>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          isActive ? "active" : undefined
        }
      >
        <span className="menu-item-content">
          <span className="menu-item-icon">
            {item.icon}
          </span>

          <span>{item.label}</span>
        </span>
      </NavLink>
    );
  }

  return (
    <aside className="sidebar">

      <NavLink className="logo" to="/dashboard">
        kaly<span>ma</span>
      </NavLink>

      <div className="menu-label">
        Workspace
      </div>

      <nav className="menu">
        {menuItems.map(renderMenuItem)}
      </nav>

      <div className="menu-label">
        Compte
      </div>

      <nav className="menu">
        {accountItems.map(renderMenuItem)}
      </nav>

      <div className="side-bottom">
        <div
          style={{
            fontSize: "11px",
            color: "#aebce0",
          }}
        >
          PLAN ACTUEL
        </div>

        <strong>
          Growth Partner
        </strong>

        <div
          style={{
            fontSize: "11px",
            color: "#aebce0",
            marginTop: "5px",
          }}
        >
          Accès complet
        </div>
      </div>

      <button
        type="button"
        className="sidebar-logout"
        onClick={handleSignOut}
      >
        <span className="sidebar-logout-icon">
          ↪
        </span>

        <span>
          Se déconnecter
        </span>
      </button>

    </aside>
  );
}

export default Sidebar;