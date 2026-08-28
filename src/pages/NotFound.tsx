import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="max-w-md mx-auto p-12 text-center space-y-3">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-sm text-zinc-500">Page not found</p>
      <Link to="/" className="inline-block border border-zinc-300 rounded-lg px-4 py-2 text-sm hover:bg-zinc-50">Go home</Link>
    </div>
  );
}
