import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Log = { id: string; userId: string | null; user: { username: string } | null; action: string; entity: string; entityId: string | null; detail: string | null; createdAt: string };

export default function AuditLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/audit-logs", { params: { action: action || undefined, entity: entity || undefined, page, limit: 20 } });
      setLogs(res.data.data);
      setMeta(res.data.meta);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, action, entity]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-lg font-semibold">Audit Logs</h1>
      <div className="flex gap-2">
        <select value={action} onChange={e => setAction(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All actions</option><option>LOGIN</option><option>LOGOUT</option><option>CREATE</option><option>UPDATE</option><option>DELETE</option>
        </select>
        <select value={entity} onChange={e => setEntity(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All entities</option><option>User</option><option>Application</option><option>UserApplication</option><option>Contact</option>
        </select>
        <button onClick={() => { setPage(1); load(); }} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm">Filter</button>
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b"><tr><th className="text-left p-3">Time</th><th className="text-left p-3">User</th><th className="text-left p-3">Action</th><th className="text-left p-3">Entity</th><th className="text-left p-3">Detail</th></tr></thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <tr key={i} className="border-b"><td colSpan={5} className="p-3"><div className="h-4 bg-zinc-100 rounded animate-pulse" /></td></tr>)
            ) : logs.map(l => (
              <tr key={l.id} className="border-b border-zinc-100">
                <td className="p-3 text-zinc-500 text-xs">{new Date(l.createdAt).toLocaleString("id-ID")}</td>
                <td className="p-3">{l.user?.username || l.userId || "-"}</td>
                <td className="p-3">{l.action}</td>
                <td className="p-3">{l.entity}{l.entityId ? ` #${l.entityId.slice(0, 8)}` : ""}</td>
                <td className="p-3 text-zinc-500">{l.detail || "-"}</td>
              </tr>
            ))}
            {!loading && logs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No logs</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-500">Total {meta.total}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border border-zinc-300 rounded-lg px-3 py-1.5 disabled:opacity-50">Prev</button>
          <span className="px-3 py-1.5">Page {meta.page}</span>
          <button disabled={page * meta.limit >= meta.total} onClick={() => setPage(p => p + 1)} className="border border-zinc-300 rounded-lg px-3 py-1.5 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
