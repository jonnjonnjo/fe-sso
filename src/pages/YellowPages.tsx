import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Contact = { id: string; name: string; employeeId: string; department: string; parentDepartment: string | null; position: string; email: string | null; phone: string | null; location: string | null; status: string };

export default function YellowPages() {
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState<Contact[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", employeeId: "", department: "", position: "", email: "", phone: "", location: "" });

  const isAdmin = (() => {
    try { return JSON.parse(atob((localStorage.getItem("token")||"").split(".")[1])).role === "Admin"; } catch { return false; }
  })();

  const load = async () => {
    const res = await api.get("/contacts", { params: { q: q || undefined, department: department || undefined, location: location || undefined, page, limit: 20 } });
    setData(res.data.data);
    setMeta(res.data.meta);
  };

  useEffect(() => { load().catch(() => {}); }, [page]);
  useEffect(() => { setPage(1); }, [q, department, location]);

  const openDetail = async (id: string) => {
    const res = await api.get(`/contacts/${id}`);
    setSelected(res.data.data);
  };

  const create = async () => {
    await api.post("/contacts", form);
    setShowCreate(false);
    setForm({ name: "", employeeId: "", department: "", position: "", email: "", phone: "", location: "" });
    load();
  };

  const deactivate = async (id: string) => {
    if (!confirm("Deactivate this contact?")) return;
    await api.patch(`/contacts/${id}/deactivate`);
    setSelected(null);
    load();
  };

  const startEdit = (c: Contact) => {
    setEditing(c);
    setSelected(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await api.patch(`/contacts/${editing.id}`, {
      name: editing.name,
      department: editing.department,
      position: editing.position,
      email: editing.email,
      phone: editing.phone,
      location: editing.location,
    });
    setEditing(null);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Yellow Pages</h1>
        {isAdmin && <button onClick={() => setShowCreate(true)} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm">Add contact</button>}
      </div>
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
              <tr key={c.id} onClick={() => openDetail(c.id)} className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer">
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

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-3" onClick={e => e.stopPropagation()}>
            <h2 className="font-semibold">{selected.name}</h2>
            <p className="text-sm text-zinc-500">{selected.employeeId} · {selected.position}</p>
            <div className="text-sm space-y-1 border-t border-zinc-200 pt-3">
              <div>Department: {selected.department} {selected.parentDepartment && `(${selected.parentDepartment})`}</div>
              <div>Email: {selected.email || "-"}</div>
              <div>Phone: {selected.phone || "-"}</div>
              <div>Location: {selected.location || "-"}</div>
              <div>Status: {selected.status}</div>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button onClick={() => startEdit(selected)} className="flex-1 border border-zinc-300 rounded-lg py-2 text-sm">Edit</button>
                {selected.status === "ACTIVE" && <button onClick={() => deactivate(selected.id)} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm">Deactivate</button>}
              </div>
            )}
            <button onClick={() => setSelected(null)} className="w-full border border-zinc-300 rounded-lg py-2 text-sm">Close</button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-3">
            <h2 className="font-semibold">Edit contact</h2>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input value={editing.department} onChange={e => setEditing({ ...editing, department: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input value={editing.position} onChange={e => setEditing({ ...editing, position: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input value={editing.email || ""} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="Email" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input value={editing.location || ""} onChange={e => setEditing({ ...editing, location: e.target.value })} placeholder="Location" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setEditing(null)} className="flex-1 border border-zinc-300 rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={saveEdit} className="flex-1 bg-zinc-900 text-white rounded-lg py-2 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-3">
            <h2 className="font-semibold">Add contact</h2>
            <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Employee ID * (EMP...)" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Department *" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Position *" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-zinc-300 rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={create} className="flex-1 bg-zinc-900 text-white rounded-lg py-2 text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
