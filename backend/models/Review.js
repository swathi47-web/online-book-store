import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);
