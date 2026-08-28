import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const role = (() => {
    try { return JSON.parse(atob((localStorage.getItem("token")||"").split(".")[1])).role; } catch { return null; }
  })();

  if (!isAuthenticated) return null;

  const doLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="border-b border-zinc-200 bg-white px-6 py-3 flex items-center gap-4 text-sm">
      <Link to="/" className="font-semibold">SSO</Link>
      <Link to="/yellow-pages" className="hover:underline">Yellow Pages</Link>
      {role === "Admin" && (
        <>
          <Link to="/admin/users" className="hover:underline">Users</Link>
          <Link to="/admin/apps" className="hover:underline">Apps</Link>
          <Link to="/admin/audit-logs" className="hover:underline">Logs</Link>
        </>
      )}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-zinc-500 text-xs">{role}</span>
        <button onClick={doLogout} className="border border-zinc-300 rounded-lg px-3 py-1.5 hover:bg-zinc-50">Logout</button>
      </div>
    </nav>
  );
}
