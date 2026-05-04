import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, Mail, User, Layers3 } from "lucide-react";
import { apiUrl } from "../lib/api";

export default function History() {
  const navigate = useNavigate();
  const readStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  };

  const [history, setHistory] = useState(readStoredUser()?.history || []);
  const [user, setUser] = useState(readStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(apiUrl("/api/users/profile"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setHistory(data.history || []);
          setUser(data);
          try {
            localStorage.setItem("user", JSON.stringify(data));
          } catch {
            // Ignore storage errors.
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    const handleFocus = () => fetchHistory();
    const handlePageShow = () => fetchHistory();
    const handleSessionUpdate = () => {
      const sessionUser = readStoredUser();
      setUser(sessionUser);
      setHistory(sessionUser?.history || []);
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("bookstore-session-updated", handleSessionUpdate);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("bookstore-session-updated", handleSessionUpdate);
    };
  }, [navigate]);

  const stats = [
    { label: "User", value: user?.username || "Reader", icon: User },
    { label: "Email", value: user?.email || "Not loaded", icon: Mail },
    { label: "Opened", value: history.length, icon: Clock3 },
    { label: "Type", value: history.length > 0 ? "Active" : "Empty", icon: Layers3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-indigo-900 to-purple-900 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Reading log</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">History</h1>
              <p className="max-w-2xl text-white/85 sm:text-lg">
                A quick look at the books you have opened recently.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white/12 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-white/75">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs uppercase tracking-[0.22em]">{item.label}</span>
                    </div>
                    <p className="mt-3 break-words text-lg font-semibold text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {loading ? (
          <p className="text-center text-slate-600">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">No reading history yet</h2>
            <p className="mt-2 text-slate-600">Open a book detail page and it will appear here.</p>
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="mt-6 rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {history.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/books/${book._id}`)}
                  className="block w-full text-left"
                >
                  <img
                    src={book.coverImage || book.cover || "https://placehold.co/600x900?text=Book"}
                    alt={book.title}
                    className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="space-y-3 p-5">
                    <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {book.genre || "General"}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">{book.title}</h2>
                    <p className="text-sm text-slate-500">{book.author}</p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
