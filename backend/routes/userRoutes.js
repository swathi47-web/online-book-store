import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const getUserId = (req) => req.user?._id || req.user?.id;

router.post("/favorites/:bookId", protect, async (req, res) => {
  const userId = getUserId(req);
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: req.params.bookId } },
    { new: true }
  ).populate("favorites history");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ favorites: user.favorites });
});

router.delete("/favorites/:bookId", protect, async (req, res) => {
  const userId = getUserId(req);
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorites: req.params.bookId } },
    { new: true }
  ).populate("favorites history");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ favorites: user.favorites });
});

router.post("/history/:bookId", protect, async (req, res) => {
  const userId = getUserId(req);
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { history: req.params.bookId } },
    { new: true }
  ).populate("favorites history");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ history: user.history });
});

router.get("/profile", protect, async (req, res) => {
  const userId = getUserId(req);
  const user = await User.findById(userId).populate("favorites history");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    favorites: user.favorites,
    history: user.history,
  });
});

export default router;
