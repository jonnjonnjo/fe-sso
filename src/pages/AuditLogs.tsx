import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Log = { id: string; userId: string | null; user: { username: string } | null; action: string; entity: string; entityId: string | null; detail: string | null; createdAt: string };

export default function AuditLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/audit-logs", { params: { action: action || undefined, entity: entity || undefined, page, limit } });
      setLogs(res.data.data);
      setMeta(res.data.meta);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, limit, action, entity]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-lg font-semibold">Audit Logs</h1>
      <div className="flex gap-2">
        <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All actions</option><option>LOGIN</option><option>LOGOUT</option><option>CREATE</option><option>UPDATE</option><option>DELETE</option>
        </select>
        <select value={entity} onChange={e => { setEntity(e.target.value); setPage(1); }} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All entities</option><option>User</option><option>Application</option><option>UserApplication</option><option>Contact</option>
        </select>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-t border-zinc-200 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Total {meta.total} · Page {meta.page} of {Math.ceil(meta.total / meta.limit) || 1}</span>
          <span className="text-zinc-300">·</span>
          <label className="text-zinc-500">Show</label>
          <select value={limit} onChange={e => { setLimit(parseInt(e.target.value)); setPage(1); }} className="border border-zinc-300 rounded-lg px-2 py-1 text-sm bg-white">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border border-zinc-300 rounded-lg px-3 py-1.5 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>
          <span className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-medium">{meta.page}</span>
          <button disabled={page * meta.limit >= meta.total} onClick={() => setPage(p => p + 1)} className="border border-zinc-300 rounded-lg px-3 py-1.5 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
        </div>
      </div>
    </div>
  );
}
