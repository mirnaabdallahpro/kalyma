import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Business from "./pages/Business";
import BusinessOffers from "./pages/business/BusinessOffers";
import BusinessOverview from "./pages/business/BusinessOverview";
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessStrategy from "./pages/business/BusinessStrategy";

import ComingSoon from "./pages/ComingSoon";
import Dashboard from "./pages/Dashboard";

import BusinessDiagnostics from "./pages/business/BusinessDiagnostics";
import Home from "./pages/Home";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            ROOT
        ========================= */}
        <Route path="/" element={<Home />} />


        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =========================
            BUSINESS
        ========================= */}

        <Route
          path="/business"
          element={<Business />}
        >
          {/* /business */}
          <Route
            index
            element={<BusinessOverview />}
          />

          {/* /business/profile */}
          <Route
            path="profile"
            element={<BusinessProfile />}
          />

          {/* /business/offers */}
          <Route
            path="offers"
            element={<BusinessOffers />}
          />
          <Route
  path="strategy"
  element={<BusinessStrategy />}
/>

    <Route
  path="diagnostics"
  element={<BusinessDiagnostics />}
/>
        </Route>

        {/* =========================
            COMING SOON
        ========================= */}

        <Route
          path="/coming-soon"
          element={<ComingSoon />}
        />

        {/* =========================
            404
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;