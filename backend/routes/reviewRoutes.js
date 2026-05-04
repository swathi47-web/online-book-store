import express from "express";
import Review from "../models/Review.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const getUserId = (req) => req.user?._id || req.user?.id;

router.post("/:bookId", protect, async (req, res) => {
  try {
    const review = new Review({
      bookId: req.params.bookId,
      userId: getUserId(req),
      reviewText: req.body.reviewText,
    });
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate("userId", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
