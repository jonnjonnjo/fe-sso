import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Contact = { id: string; name: string; employeeId: string; department: string; location: string | null; status: string; position: string };

export default function YellowPages() {
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState<Contact[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);

  const load = async () => {
    const res = await api.get("/contacts", { params: { q: q || undefined, department: department || undefined, location: location || undefined, page, limit: 20 } });
    setData(res.data.data);
    setMeta(res.data.meta);
  };

  useEffect(() => { load().catch(() => {}); }, [page]);
  useEffect(() => { setPage(1); }, [q, department, location]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-lg font-semibold">Yellow Pages</h1>
      <div className="flex gap-2 flex-wrap">
        <input placeholder="Search name or ID" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
        <select value={department} onChange={e => setDepartment(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All departments</option><option>Engineering</option><option>HR</option><option>Finance</option><option>Marketing</option>
        </select>
        <select value={location} onChange={e => setLocation(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All locations</option><option>Jakarta</option><option>Bandung</option><option>Surabaya</option>
        </select>
        <button onClick={load} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm">Search</button>
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200"><tr><th className="text-left p-3 font-medium">Name</th><th className="text-left p-3 font-medium">ID</th><th className="text-left p-3 font-medium">Dept</th><th className="text-left p-3 font-medium">Location</th><th className="text-left p-3 font-medium">Status</th></tr></thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="p-3">{c.name}</td><td className="p-3 text-zinc-500">{c.employeeId}</td><td className="p-3">{c.department}</td><td className="p-3">{c.location}</td><td className="p-3">{c.status}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No contacts</td></tr>}
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
