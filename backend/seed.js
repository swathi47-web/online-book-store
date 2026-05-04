import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Book from "./models/Book.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const data = JSON.parse(fs.readFileSync("../books.json", "utf-8"));

async function seedDB() {
  try {
    await Book.deleteMany({});
    await Book.insertMany(data);
    console.log("✅ Books Added to MongoDB!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
