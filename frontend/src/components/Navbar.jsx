import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Books", to: "/books" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Favorites", to: "/favorites" },
  { label: "History", to: "/history" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const syncAuth = () => setIsAuthed(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", syncAuth);
    syncAuth();
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthed(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/30">
            <BookOpen className="h-5 w-5" />
          </span>
          BookDiscover
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-medium text-white/75 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {isAuthed ? (
            <>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
              <Link
                to="/dashboard"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-indigo-100"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {isAuthed ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-white/15 px-4 py-3 text-left text-white/85 transition hover:bg-white/10"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-indigo-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-400"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/15 px-4 py-3 text-center text-white/85 transition hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-indigo-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-400"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
