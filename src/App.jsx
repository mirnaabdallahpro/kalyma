import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Business from "./pages/Business";
import ComingSoon from "./pages/ComingSoon";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/business" element={<Business />} />

        {/* Modules pas encore développés — placeholder en attendant */}
        <Route path="/crm" element={<ComingSoon title="CRM" />} />
        <Route path="/tasks" element={<ComingSoon title="Tâches" />} />
        <Route path="/meetings" element={<ComingSoon title="Rendez-vous" />} />
        <Route path="/messages" element={<ComingSoon title="Messages" />} />
        <Route path="/documents" element={<ComingSoon title="Documents" />} />
        <Route path="/settings" element={<ComingSoon title="Paramètres" />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
