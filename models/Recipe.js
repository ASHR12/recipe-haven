import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    recipeId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
