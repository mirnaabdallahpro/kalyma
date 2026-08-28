import {
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UsersRound,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../../services/authService";
import KalymaLogo from "../../assets/brands/kalyma-logo.svg";

function Sidebar() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
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

  const menuItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      disabled: false,
    },
    {
      to: "/business",
      icon: BriefcaseBusiness,
      label: "Business",
      disabled: false,
    },
    {
      to: "/crm",
      icon: UsersRound,
      label: "CRM",
      disabled: false,
    },
    {
      to: "/tasks",
      icon: CheckSquare,
      label: "Tâches",
      disabled: false,
    },
    {
      to: "/meetings",
      icon: CalendarDays,
      label: "Rendez-vous",
      disabled: false,
    },
    {
      to: "/messages",
      icon: MessageSquare,
      label: "Messages",
      disabled: true,
    },
    {
      to: "/documents",
      icon: FileText,
      label: "Documents",
      disabled: true,
    },
  ];

  const accountItems = [
    {
      to: "/settings",
      icon: Settings,
      label: "Paramètres",
      disabled: true,
    },
  ];

  function renderMenuItem(item) {
    const Icon = item.icon;

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
              <Icon
                size={20}
                strokeWidth={1.8}
              />
            </span>

            <span>{item.label}</span>
          </span>

          <span className="menu-item-status">
            <span className="menu-item-status-icon">
              ⚙
            </span>
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
            <Icon
              size={20}
              strokeWidth={1.8}
            />
          </span>

          <span>{item.label}</span>
        </span>
      </NavLink>
    );
  }

  return (
    <aside className="sidebar">

     <NavLink className="logo" to="/dashboard">
        <img src={KalymaLogo} alt="Kalyma" />
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