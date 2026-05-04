import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock3, Heart, Layers3, Mail, ShieldCheck } from "lucide-react";
import { apiUrl } from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const [userData, setUserData] = useState(storedUser);
  const [loading, setLoading] = useState(true);

  const syncFromStorage = () => {
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user")) || null;
      if (sessionUser) setUserData(sessionUser);
    } catch {
      // Ignore storage parse issues.
    }
  };

  const refreshProfile = async () => {
    const tokenValue = localStorage.getItem("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/users/profile"), {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        try {
          localStorage.setItem("user", JSON.stringify(data));
        } catch {
          // Ignore storage write issues.
        }
      }
    } catch {
      // Keep the dashboard usable from stored session data.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();

    const handleFocus = () => refreshProfile();
    const handlePageShow = () => refreshProfile();
    const handleStorage = (event) => {
      if (event.key === "user" || event.key === "token") {
        refreshProfile();
      }
    };
    const handleSessionUpdate = () => syncFromStorage();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("bookstore-session-updated", handleSessionUpdate);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("bookstore-session-updated", handleSessionUpdate);
    };
  }, []);

  const displayName = userData?.username || "Reader";
  const displayEmail = userData?.email || "No email saved";
  const roleLabel = userData?.role || "user";
  const favorites = userData?.favorites || [];
  const history = userData?.history || [];

  if (loading && !userData) {
    return <p className="mt-10 text-center">Loading...</p>;
  }

  const statCards = [
    { label: "Email", value: displayEmail, icon: Mail },
    { label: "Favorites", value: favorites.length, icon: Heart },
    { label: "History", value: history.length, icon: Clock3 },
  ];

  const actions = [
    {
      title: "Favorites",
      desc: favorites.length > 0 ? `${favorites.length} books saved` : "No favorites yet.",
      icon: Heart,
      onClick: () => navigate("/favorites"),
      tone: "from-fuchsia-500 to-pink-500",
    },
    {
      title: "History",
      desc: history.length > 0 ? `${history.length} books read` : "No reading history yet.",
      icon: Clock3,
      onClick: () => navigate("/history"),
      tone: "from-indigo-500 to-sky-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Account Overview</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome, {displayName}</h1>
              <p className="max-w-2xl text-white/85 sm:text-lg">
                You are signed in as <span className="font-semibold">{roleLabel}</span>. Use the cards below to
                explore your saved books and reading activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              {statCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white/12 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-white/75">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm uppercase tracking-[0.2em]">{item.label}</span>
                    </div>
                    <p className="mt-3 break-words text-lg font-semibold text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={item.onClick}
                className="group relative overflow-hidden rounded-[2rem] bg-white p-7 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.tone}`} />
                <div className="flex items-start gap-4">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-base text-slate-600">{item.desc}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span>Open section</span>
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {userData?.role === "admin" ? (
          <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl ring-1 ring-slate-900/10">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <p className="text-white/70">Manage books & users</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Open Admin
            </button>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
                <BookOpen className="h-6 w-6" />
              </span>
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900">Continue exploring</h2>
                <p className="mt-2 text-slate-600">
                  Browse the catalog to start building your favorites and history.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="mt-6 rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Browse Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
