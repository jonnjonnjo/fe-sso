import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type LandingData = {
  user: { id: string; username: string; status: string; role: string };
  applications: { id: string; name: string; url: string | null }[];
};

export default function Landing() {
  const [data, setData] = useState<LandingData | null>(null);
  const [err, setErr] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/landing").then(res => setData(res.data.data)).catch(e => setErr(e.response?.data?.message || "Failed to load"));
  }, []);

  if (err) return <div className="p-8 text-sm text-red-600">{err}</div>;
  if (!data) return <div className="p-8 text-sm text-zinc-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="font-semibold">SSO Portal</h1>
        <button onClick={logout} className="text-sm border border-zinc-300 rounded-lg px-3 py-1.5 hover:bg-zinc-50">Logout</button>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <section className="bg-white border border-zinc-200 rounded-lg p-5">
          <h2 className="font-medium">Welcome, {data.user.username}</h2>
          <p className="text-sm text-zinc-500 mt-1">{data.user.role} · {data.user.status}</p>
        </section>
        <section>
          <h3 className="font-medium mb-3">Your applications</h3>
          {data.applications.length === 0 ? (
            <p className="text-sm text-zinc-500 border border-dashed border-zinc-300 rounded-lg p-6 text-center">No applications assigned. Contact admin.</p>
          ) : (
            <div className="grid gap-3">
              {data.applications.map(app => (
                <a key={app.id} href={app.url || "#"} className="bg-white border border-zinc-200 rounded-lg p-4 hover:border-zinc-300">
                  <div className="font-medium text-sm">{app.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{app.url}</div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
