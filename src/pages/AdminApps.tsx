import { useEffect, useState } from "react";
import { api } from "../lib/api";

type App = { id: string; name: string; url: string | null };
type User = { id: string; username: string };

export default function AdminApps() {
  const [apps, setApps] = useState<App[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [userApps, setUserApps] = useState<App[]>([]);
  const [grantAppId, setGrantAppId] = useState("");

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      setApps(res.data.data);
    } finally { setLoading(false); }
  };
  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };
  const loadUserApps = async (uid: string) => {
    if (!uid) return;
    const res = await api.get(`/users/${uid}/applications`);
    setUserApps(res.data.data);
  };

  useEffect(() => { loadApps(); loadUsers(); }, []);
  useEffect(() => { if (selectedUser) loadUserApps(selectedUser); else setUserApps([]); }, [selectedUser]);

  const create = async () => {
    await api.post("/applications", { name, url: url || null });
    setName(""); setUrl(""); loadApps();
  };

  const grant = async () => {
    await api.post(`/users/${selectedUser}/applications`, { applicationId: grantAppId });
    loadUserApps(selectedUser);
  };

  const revoke = async (appId: string) => {
    await api.delete(`/users/${selectedUser}/applications/${appId}`);
    loadUserApps(selectedUser);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-lg font-semibold">Admin — Applications</h1>

      <section className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
        <h2 className="font-medium text-sm">Applications</h2>
        <div className="flex gap-2">
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
          <input placeholder="URL (e.g. /hr-portal)" value={url} onChange={e => setUrl(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1" />
          <button onClick={create} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm">Create</button>
        </div>
        <div className="space-y-2">
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-10 bg-zinc-100 rounded animate-pulse" />)
          ) : apps.map(a => (
            <div key={a.id} className="flex items-center justify-between border border-zinc-200 rounded-lg px-3 py-2 text-sm">
              <span>{a.name} <span className="text-zinc-500">{a.url}</span></span>
              <span className="text-xs text-zinc-500">{a.id.slice(0, 8)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
        <h2 className="font-medium text-sm">Grant access — Admin decides</h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              placeholder="Search user by name"
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm"
            />
            {userQuery && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-lg shadow max-h-40 overflow-auto">
                {users.filter(u => u.username.toLowerCase().includes(userQuery.toLowerCase())).slice(0, 8).map(u => (
                  <button
                    key={u.id}
                    onClick={() => { setSelectedUser(u.id); setUserQuery(u.username); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 ${selectedUser === u.id ? "bg-zinc-100" : ""}`}
                  >
                    {u.username}
                  </button>
                ))}
                {users.filter(u => u.username.toLowerCase().includes(userQuery.toLowerCase())).length === 0 && (
                  <div className="px-3 py-2 text-sm text-zinc-500">No match</div>
                )}
              </div>
            )}
          </div>
          <select value={grantAppId} onChange={e => setGrantAppId(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1">
            <option value="">Select app</option>
            {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button onClick={grant} disabled={!selectedUser || !grantAppId} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50">Grant</button>
        </div>
        {selectedUser && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Apps for {users.find(u => u.id === selectedUser)?.username}:</p>
            {userApps.map(a => (
              <div key={a.id} className="flex items-center justify-between border border-zinc-200 rounded-lg px-3 py-2 text-sm">
                <span>{a.name}</span>
                <button onClick={() => revoke(a.id)} className="text-xs border border-red-300 text-red-600 rounded px-2 py-1">Revoke</button>
              </div>
            ))}
            {userApps.length === 0 && <p className="text-sm text-zinc-500">No access yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
