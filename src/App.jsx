import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminBusinessClientDetail from "./pages/admin/AdminBusinessClientDetail";
import AdminBusinessClients from "./pages/admin/AdminBusinessClients";
import AdminBusinessDiagnostic from "./pages/admin/AdminBusinessDiagnostic";
import AdminBusinessDiagnosticDetail from "./pages/admin/AdminBusinessDiagnosticDetail";
import Business from "./pages/Business";
import BusinessOffers from "./pages/business/BusinessOffers";
import BusinessOverview from "./pages/business/BusinessOverview";
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessStrategy from "./pages/business/BusinessStrategy";
import ComingSoon from "./pages/ComingSoon";
import Crm from "./pages/Crm";
import Dashboard from "./pages/Dashboard";
import Objectives from "./pages/Objectives";
import Tasks from "./pages/Tasks";


import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import BusinessDiagnostics from "./pages/business/BusinessDiagnostics";
import Home from "./pages/Home";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
      <Routes>

        {/* =========================
            ROOT
        ========================= */}


        <Route path="/" element={<Home />} />

         {/* =================================
              PUBLIC
          ================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/coming-soon"
            element={<ComingSoon />}
          />

          <Route
            path="/admin/business"
            element={<AdminBusinessClients />}
          />

          <Route
              path="/admin/business/:clientId"
              element={<AdminBusinessClientDetail />}
            />

                  
          <Route
            path="/admin/business/:clientId/diagnostic"
            element={<AdminBusinessDiagnostic />}
          />

          <Route
            path="/admin/business/:clientId/diagnostic/:diagnosticId"
            element={<AdminBusinessDiagnosticDetail />}
          />



        {/* =========================
            DASHBOARD
        ========================= */}

         <Route element={<ProtectedRoute />}>


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
                path="goals"
                element={<Objectives />}
              />



                <Route
              path="diagnostics"
              element={<BusinessDiagnostics />}
            />
        </Route>

          <Route path="/tasks" element={<Tasks />} />
          <Route path="/crm" element={<Crm />} />
          

       

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
        </Route>

      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;