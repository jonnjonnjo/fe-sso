import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute } from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import YellowPages from "./pages/YellowPages";
import AdminUsers from "./pages/AdminUsers";
import AdminApps from "./pages/AdminApps";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/yellow-pages" element={<ProtectedRoute><YellowPages /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><RoleRoute role="Admin"><AdminUsers /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/apps" element={<ProtectedRoute><RoleRoute role="Admin"><AdminApps /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute><RoleRoute role="Admin"><AuditLogs /></RoleRoute></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
