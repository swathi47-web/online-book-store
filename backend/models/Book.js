import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  coverImage: String,
  file_url: String
});

export default mongoose.model("Book", bookSchema);
