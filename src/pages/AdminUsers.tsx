import { useEffect, useState } from "react";
import { api } from "../lib/api";

type User = { id: string; username: string; activeStatus: string; role: { id: string; name: string }; createdAt: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });
  const [editing, setEditing] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ username: "", activeStatus: "ACTIVE", roleId: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([api.get("/users", { params: { q: q || undefined } }), api.get("/roles")]);
      setUsers(uRes.data.data);
      setRoles(rRes.data.data);
    } finally { setLoading(false); }
  };
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      setToast("Username and password are required"); setTimeout(() => setToast(""), 2000); return;
    }
    try {
      await api.post("/users", form);
      setForm({ username: "", password: "" });
      setToast("User created"); setTimeout(() => setToast(""), 2000);
      load();
    } catch (e: any) {
      setToast(e.response?.data?.message || "Create failed"); setTimeout(() => setToast(""), 2000);
    }
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEditForm({ username: u.username, activeStatus: u.activeStatus, roleId: u.role.id });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await api.patch(`/users/${editing.id}`, editForm);
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setToast("User deleted"); setTimeout(() => setToast(""), 2000);
      load();
    } catch (e: any) {
      setToast(e.response?.data?.message || "Delete failed"); setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-lg font-semibold">Admin — Users</h1>

      {toast && <div className="fixed top-4 right-4 bg-zinc-900 text-white text-sm rounded-lg px-4 py-2 shadow-lg z-50">{toast}</div>}

      <div className="flex gap-2">
        <input placeholder="Search username" value={q} onChange={e => setQ(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-4 flex gap-2">
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
        <button onClick={create} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm">Create</button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b"><tr><th className="text-left p-3">Username</th><th className="text-left p-3">Role</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i} className="border-b"><td colSpan={4} className="p-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td></tr>)
            ) : users.map(u => (
              <tr key={u.id} className="border-b border-zinc-100">
                <td className="p-3">{u.username}</td><td className="p-3">{u.role.name}</td><td className="p-3">{u.activeStatus}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => startEdit(u)} className="text-sm border border-zinc-300 rounded px-3 py-1">Edit</button>
                  <button onClick={() => del(u.id)} className="text-sm border border-red-300 text-red-600 rounded px-3 py-1">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No users</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-3">
            <h2 className="font-medium">Edit {editing.username}</h2>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Username</label>
              <input value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Role</label>
              <select value={editForm.roleId} onChange={e => setEditForm({ ...editForm, roleId: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm">
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Status</label>
              <select value={editForm.activeStatus} onChange={e => setEditForm({ ...editForm, activeStatus: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm">
                <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(null)} className="flex-1 border border-zinc-300 rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={saveEdit} className="flex-1 bg-zinc-900 text-white rounded-lg py-2 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
