import { useEffect, useRef, useState } from "react";
import { BookOpen, Compass, Heart, Search, Star, Brain, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "History", desc: "Past events & civilizations", icon: BookOpen },
  { name: "Fantasy", desc: "Magic, myths & adventures", icon: Star },
  { name: "Science", desc: "Discoveries & knowledge", icon: Brain },
  { name: "Mystery", desc: "Thrillers & crime stories", icon: Compass },
  { name: "Romance", desc: "Love & relationships", icon: Heart },
  { name: "Biography", desc: "Life stories of people", icon: User },
];

const highlights = [
  { value: "10K+", label: "Books to explore" },
  { value: "6", label: "Popular genres" },
  { value: "24/7", label: "Always available" },
];

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categoriesRef = useRef(null);
  const collectionsRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleScrollTo = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,#0f172a_0%,#312e81_45%,#111827_100%)] text-white">
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-500 ${
          scrollPosition > 50
            ? "border-white/10 bg-slate-950/90 py-3 shadow-lg backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-left text-lg font-bold tracking-wide text-white sm:text-xl"
          >
            BookDiscover
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            <button onClick={() => handleScrollTo(categoriesRef)} className="text-white/80 transition hover:text-white">
              Categories
            </button>
            <button onClick={() => handleScrollTo(collectionsRef)} className="text-white/80 transition hover:text-white">
              Collections
            </button>
            <button onClick={() => handleScrollTo(aboutRef)} className="text-white/80 transition hover:text-white">
              About
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Join Now
            </button>
          </div>
        </div>
      </nav>

      <section className="flex min-h-screen flex-col justify-center px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
              Curated reading made simple
            </span>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
                Discover Your <span className="text-indigo-300">Next Favorite Book</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Browse classics, search by genre, and keep track of the stories you love in one clean place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/books")}
                className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-indigo-100"
              >
                Browse Books
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Join Now
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-white/65">{item.label}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="w-full max-w-2xl"
            >
              <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/20 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center rounded-2xl bg-black/10 px-4 py-3 ring-1 ring-white/10">
                  <Search className="mr-3 h-5 w-5 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books, authors, or genres..."
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/45"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">Featured</p>
              <h2 className="mt-3 text-2xl font-bold">A better reading space</h2>
              <p className="mt-3 text-white/70">
                Find titles by mood, genre, or author and keep your reading journey tidy.
              </p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-indigo-400 to-fuchsia-500 p-6 text-slate-950 shadow-2xl shadow-fuchsia-950/30">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-950/70">Quick start</p>
              <h2 className="mt-3 text-2xl font-bold">Open the catalog</h2>
              <p className="mt-3 text-slate-950/75">Jump straight to the books page and start exploring.</p>
              <button
                type="button"
                onClick={() => navigate("/books")}
                className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
              >
                View Books
              </button>
            </div>
          </div>
        </div>
      </section>

      <section ref={categoriesRef} className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Browse by</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Explore Categories</h2>
            </div>
            <p className="max-w-xl text-white/65">
              Pick a genre and dive into a collection that matches the kind of story you want right now.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => navigate(`/books?genre=${encodeURIComponent(cat.name)}`)}
                  className="group rounded-[2rem] border border-white/10 bg-white/10 p-6 text-left transition hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-6 w-6 text-indigo-200" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{cat.name}</h3>
                  <p className="mt-2 text-white/70">{cat.desc}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-indigo-200 transition group-hover:translate-x-1">
                    Explore now
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={collectionsRef} className="bg-slate-950/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Curated picks</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Popular Collections</h2>
          <p className="mt-4 max-w-3xl text-white/70">
            This space can surface editor picks, trending books, or seasonal reading lists from the backend later.
          </p>
        </div>
      </section>

      <section ref={aboutRef} className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">About</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Built for readers</h2>
          <p className="mt-4 text-white/70">
            Welcome to BookDiscover. The goal is to make browsing, saving, and revisiting books feel easy and
            inviting on every device.
          </p>
        </div>
      </section>
    </div>
  );
}
