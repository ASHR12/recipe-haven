import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    recipeId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Bookmark ||
  mongoose.model("Bookmark", BookmarkSchema);
