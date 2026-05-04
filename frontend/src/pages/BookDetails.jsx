import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const token = localStorage.getItem("token");

  const readStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };

  const syncStoredUser = (patch) => {
    const currentUser = readStoredUser();
    localStorage.setItem("user", JSON.stringify({ ...currentUser, ...patch }));
    window.dispatchEvent(new Event("bookstore-session-updated"));
  };

  const recordHistory = async () => {
    if (!token) return;

    const res = await axios.post(
      `http://localhost:5000/api/users/history/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data?.history) {
      syncStoredUser({ history: res.data.history });
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError("");

      try {
        const bookRes = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(bookRes.data);
      } catch {
        setError("Failed to load book details.");
        setLoading(false);
        return;
      }

      try {
        await recordHistory();
      } catch {
        // History should not block the page.
      }

      try {
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(reviewsRes.data || []);
      } catch {
        setReviews([]);
      }

      setLoading(false);
    };

    fetchBook();
  }, [id, token]);

  const canReview = useMemo(() => Boolean(token), [token]);

  const saveToFavorites = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/favorites/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.error) {
        setActionMessage(res.data.error);
        return;
      }
      if (res.data?.favorites) {
        syncStoredUser({ favorites: res.data.favorites });
      }
      setActionMessage("Saved to favorites.");
    } catch {
      const currentUser = readStoredUser();
      const fallbackFavorites = Array.isArray(currentUser.favorites) ? currentUser.favorites : [];
      const nextFavorites = fallbackFavorites.some((item) => item?._id === book._id)
        ? fallbackFavorites
        : [...fallbackFavorites, book];
      syncStoredUser({ favorites: nextFavorites });
      setActionMessage("Saved locally.");
    }
  };

  const openBook = async () => {
    try {
      await recordHistory();
    } catch {
      const currentUser = readStoredUser();
      const fallbackHistory = Array.isArray(currentUser.history) ? currentUser.history : [];
      const nextHistory = fallbackHistory.some((item) => item?._id === book._id)
        ? fallbackHistory
        : [...fallbackHistory, book];
      syncStoredUser({ history: nextHistory });
    }

    if (book.file_url) {
      window.open(book.file_url, "_blank", "noopener,noreferrer");
    }
  };

  const submitReview = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!reviewText.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { reviewText: reviewText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviewText("");
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data || []);
      setActionMessage("Review submitted.");
    } catch {
      setActionMessage("Error submitting review.");
    }
  };

  if (loading) {
    return <p className="mt-10 text-center text-slate-600">Loading book details...</p>;
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!book) {
    return <p className="mt-10 text-center text-slate-600">Book not found.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back
        </button>

        <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
            <img
              src={book.coverImage || book.coverUrl || "https://placehold.co/600x900?text=Book"}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {book.genre || "General"}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{book.title}</h1>
            <p className="mt-3 text-lg text-slate-500">by {book.author}</p>
            <p className="mt-6 leading-8 text-slate-700">{book.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {book.file_url && (
                <button
                  type="button"
                  onClick={openBook}
                  className="inline-flex rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
                >
                  Read Book
                </button>
              )}
              <button
                type="button"
                onClick={saveToFavorites}
                className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Save to Favorites
              </button>
            </div>

            {actionMessage && <p className="mt-4 text-sm text-slate-600">{actionMessage}</p>}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
          <div className="mt-6 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article key={review._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-indigo-700">
                    {review.userId?.username || "Reader"}
                  </p>
                  <p className="mt-2 text-slate-700">{review.reviewText}</p>
                </article>
              ))
            ) : (
              <p className="text-slate-500">No reviews yet. Be the first to share one.</p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder={canReview ? "Write your review..." : "Login to write a review..."}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={!canReview}
            />
            <button
              type="button"
              onClick={submitReview}
              className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canReview}
            >
              Submit Review
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
