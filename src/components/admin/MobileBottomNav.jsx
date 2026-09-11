
import {
    LayoutDashboard,
    MessageSquare,
    Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import EnableNotificationsButton from "../notifications/EnableNotificationsButton";

export default function MobileBottomNav({ user }) {
  return (
    <nav className="mobile-bottom-nav">

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <LayoutDashboard size={21} />
        <span>Accueil</span>
      </NavLink>

      <NavLink
        to="/messagerie"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <MessageSquare size={21} />
        <span>Messages</span>
      </NavLink>

      <NavLink
        to="/admin/business"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Users size={21} />
        <span>Clients</span>
      </NavLink>

      <div className="mobile-nav-item">
        <EnableNotificationsButton
          userId={user.id}
          compact
        />
      </div>

    </nav>
  );
}
