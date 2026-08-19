import { Outlet } from "react-router-dom";

import BusinessSidebar from "../components/business/BusinessSidebar";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import "../styles/business.css";

function Business() {
  return (
    <div className="dashboard-body">
      <div className="app">

        {/* Navigation principale Kalyma */}
        <Sidebar />

        <main className="main">

          <Topbar />

          <div className="business-layout">

            {/* Navigation interne Business */}
            <BusinessSidebar />

            {/* Sous-page Business */}
            <div className="business-content">
              <Outlet />
            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Business;