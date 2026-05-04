// routes/bookRoutes.js
import express from "express";
import Book from "../models/Book.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Add book (admin)
router.post("/", protect, adminOnly, async (req, res) => {
  const { title, author, genre, description, coverImage, cover, file_url } = req.body;
  const book = new Book({
    title,
    author,
    genre,
    description,
    coverImage: coverImage || cover,
    file_url,
  });
  await book.save();
  res.json(book);
});

// 📚 Get all books with search + pagination
router.get("/", async (req, res) => {
  const { search, genre, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { genre: { $regex: search, $options: "i" } },
    ];
  }
  if (genre) {
    query.genre = { $regex: genre, $options: "i" };
  }

  const books = await Book.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Book.countDocuments(query);

  res.json({ books, totalPages: Math.ceil(total / limit), page: Number(page) });
});

// 📖 Get book by ID
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// ❌ Delete book (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

export default router;
