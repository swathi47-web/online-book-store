// routes/historyRoutes.js
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const getUserId = (req) => req.user?._id || req.user?.id;

router.post("/:bookId", protect, async (req, res) => {
  try {
    const user = await User.findById(getUserId(req));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.history.includes(req.params.bookId)) {
      user.history.push(req.params.bookId);
    }
    await user.save();
    res.json({ history: user.history });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
