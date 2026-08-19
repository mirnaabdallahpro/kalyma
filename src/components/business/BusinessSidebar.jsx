import { NavLink } from "react-router-dom";

function BusinessSidebar() {
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

  return (
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
  );
}

export default BusinessSidebar;