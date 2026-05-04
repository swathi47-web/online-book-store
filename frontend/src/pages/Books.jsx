import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";

const chips = ["History", "Fantasy", "Science", "Mystery", "Romance", "Biography"];

export default function Books() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const currentGenre = searchParams.get("genre") || "";
  const currentPage = Number(searchParams.get("page") || 1);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (currentSearch) params.set("search", currentSearch);
        if (currentGenre) params.set("genre", currentGenre);
        params.set("page", String(currentPage));
        params.set("limit", "12");

        const res = await axios.get(`http://localhost:5000/api/books?${params.toString()}`);
        setBooks(res.data.books || []);
        setPageInfo({
          page: res.data.page || 1,
          totalPages: res.data.totalPages || 1,
        });
      } catch (err) {
        setError("Unable to load books right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentSearch, currentGenre, currentPage]);

  const title = useMemo(() => {
    if (currentGenre) return `${currentGenre} Books`;
    if (currentSearch) return `Search results for "${currentSearch}"`;
    return "Discover Books";
  }, [currentGenre, currentSearch]);

  const submitSearch = (event) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set("search", searchInput.trim());
    } else {
      next.delete("search");
    }
    next.delete("genre");
    next.set("page", "1");
    setSearchParams(next);
  };

  const selectGenre = (genre) => {
    const next = new URLSearchParams();
    next.set("genre", genre);
    next.set("page", "1");
    if (searchInput.trim()) {
      next.set("search", searchInput.trim());
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const goToPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 p-6 text-white shadow-2xl sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Library</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-white/75">
                Explore classics, browse the catalog, and open any title for reviews and reading details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-fit rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Go to Dashboard
            </button>
          </div>

          <form onSubmit={submitSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <Search className="mr-3 h-5 w-5 text-white/60" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="w-full bg-transparent text-white outline-none placeholder:text-white/45"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-indigo-100"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Clear
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => selectGenre(chip)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentGenre === chip
                    ? "bg-white text-slate-900"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {loading && <p className="text-center text-slate-600">Loading books...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <p>
                Showing {books.length} book{books.length === 1 ? "" : "s"} on page {pageInfo.page} of{" "}
                {pageInfo.totalPages}
              </p>
              <p>Tap a card to see the full reading page.</p>
            </div>

            {books.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">No books found</h2>
                <p className="mt-2 text-slate-600">
                  Try a different search term or clear the filters to see the full catalog.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <article
                    key={book._id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/books/${book._id}`)}
                      className="block w-full text-left"
                    >
                      <img
                        src={book.coverImage || book.coverUrl || "https://placehold.co/600x900?text=Book"}
                        alt={book.title}
                        className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="space-y-3 p-5">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{book.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                        </div>
                        <p className="line-clamp-3 text-sm text-slate-600">
                          {book.description || "Read more to explore this title."}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {book.genre || "General"}
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">Read more</span>
                        </div>
                      </div>
                    </button>
                  </article>
                ))}
              </div>
            )}

            {pageInfo.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {pageInfo.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(Math.min(pageInfo.totalPages, currentPage + 1))}
                  disabled={currentPage >= pageInfo.totalPages}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
