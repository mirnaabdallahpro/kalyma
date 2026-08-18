import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <NavLink className="logo" to="/dashboard">
        kaly<span>ma</span>
      </NavLink>

      <div className="menu-label">
        Workspace
      </div>

      <nav className="menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ◈ &nbsp; Dashboard
        </NavLink>

        <NavLink
          to="/business"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ◉ &nbsp; Business
        </NavLink>

        <NavLink
          to="/crm"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ◎ &nbsp; CRM
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ✓ &nbsp; Tâches
        </NavLink>

        <NavLink
          to="/meetings"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ▣ &nbsp; Rendez-vous
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ✉ &nbsp; Messages
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) => (isActive ? "active" : undefined)}
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
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          ⚙ &nbsp; Paramètres
        </NavLink>
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

    </aside>
  );
}

export default Sidebar;
