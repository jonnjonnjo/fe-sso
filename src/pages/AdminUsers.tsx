import { useEffect, useState } from "react";
import { api } from "../lib/api";

type User = { id: string; username: string; activeStatus: string; role: { id: string; name: string }; createdAt: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [editing, setEditing] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ username: "", activeStatus: "ACTIVE" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api.post("/users", form);
    setForm({ username: "", password: "" });
    load();
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEditForm({ username: u.username, activeStatus: u.activeStatus });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await api.patch(`/users/${editing.id}`, editForm);
    setEditing(null);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-lg font-semibold">Admin — Users</h1>

      <div className="bg-white border border-zinc-200 rounded-lg p-4 flex gap-2">
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
        <input placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
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
                <td className="p-3"><button onClick={() => startEdit(u)} className="text-sm border border-zinc-300 rounded px-3 py-1">Edit</button></td>
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
            <input value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <select value={editForm.activeStatus} onChange={e => setEditForm({ ...editForm, activeStatus: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm">
              <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
            </select>
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
