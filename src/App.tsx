import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import YellowPages from "./pages/YellowPages";
import AdminUsers from "./pages/AdminUsers";
import AdminApps from "./pages/AdminApps";
import AuditLogs from "./pages/AuditLogs";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/yellow-pages" element={<ProtectedRoute><YellowPages /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/apps" element={<ProtectedRoute><AdminApps /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
