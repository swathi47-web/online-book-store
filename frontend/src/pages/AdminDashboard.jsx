import { useMemo } from "react";

export default function AdminDashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin center</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-white/75">Welcome back, {user?.username || "Admin"}.</p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Books</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Manage catalog</h2>
            <p className="mt-2 text-slate-600">Create, edit, and remove books from the library.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Users</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Monitor accounts</h2>
            <p className="mt-2 text-slate-600">Keep track of user activity and admin access.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Content</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Curate collections</h2>
            <p className="mt-2 text-slate-600">Feature books, categories, and reading lists.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
