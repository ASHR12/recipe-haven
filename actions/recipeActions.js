// actions/recipeActions.js
"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/db";
import Recipe from "@/models/Recipe";
import Bookmark from "@/models/Bookmark";
import { auth } from "@clerk/nextjs/server";

export async function createRecipeAction(prevState, formData) {
  const { userId } = auth();

  if (!userId) {
    return {
      status: "Error",
      message: "You must be logged in to create a recipe.",
    };
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const ingredients = formData.get("ingredients");
  const instructions = formData.get("instructions");
  const category = formData.get("category");
  const imageUrl = formData.get("imageUrl");

  // Validate the data
  const errors = [];
  if (!title) errors.push("Title is required");
  if (!description) errors.push("Description is required");
  if (!ingredients) errors.push("Ingredients are required");
  if (!instructions) errors.push("Instructions are required");
  if (!category) errors.push("Category is required");

  if (errors.length > 0) {
    return { errors, status: "Error", message: "Please fix the errors above." };
  }

  try {
    await dbConnect();

    const recipeId = uuidv4();

    const newRecipe = new Recipe({
      recipeId,
      title,
      description,
      ingredients,
      instructions,
      category,
      imageUrl,
      userId,
    });

    await newRecipe.save();

    revalidatePath("/recipes");

    return { status: "Success", message: "Recipe created successfully!" };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return {
      status: "Error",
      message: "Failed to create recipe. Please try again.",
    };
  }
}

export async function getRecentRecipes(limit = 3) {
  const { userId } = auth();
  console.log("User ID:", userId);
  if (!userId) {
    throw new Error("User not authenticated");
  }

  await dbConnect();
  // Ensure limit is a number and set to default value if not provided
  const parsedLimit = Number(limit) || 3;

  const query = { userId };
  // console.log("Query:", query);

  const recipes = await Recipe.find(query)
    .sort({ createdAt: -1 })
    .limit(parsedLimit)
    .lean();
  // console.log("Recipes fetched count:", recipes.length);
  // recipes.forEach((recipe, index) => {
  //   console.log(
  //     `Recipe ${index + 1}: ${recipe.title}, createdAt: ${recipe.createdAt}`
  //   );
  // });

  return recipes;
}

export async function getRecentFavoriteRecipes(limit = 3) {
  const { userId } = auth();
  console.log("User ID:", userId);
  if (!userId) {
    throw new Error("User not authenticated");
  }

  await dbConnect();
  // Ensure limit is a number and set to default value if not provided
  const parsedLimit = Number(limit) || 3;

  try {
    // Get the latest bookmarks for the user
    const bookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    console.log("Bookmarks fetched count:", bookmarks.length);

    // Fetch the corresponding recipes
    const recipeIds = bookmarks.map((bookmark) => bookmark.recipeId);
    const recipes = await Recipe.find({ recipeId: { $in: recipeIds } }).lean();

    // Sort the recipes to match the order of bookmarks
    const sortedRecipes = recipeIds
      .map((id) => recipes.find((recipe) => recipe.recipeId === id))
      .filter(Boolean); // Remove any undefined entries

    console.log("Recipes fetched count:", sortedRecipes.length);
    sortedRecipes.forEach((recipe, index) => {
      console.log(
        `Recipe $${index + 1}: $${recipe.title}, bookmarked at: $${
          bookmarks[index].createdAt
        }`
      );
    });

    return sortedRecipes;
  } catch (error) {
    console.error("Error fetching recent favorite recipes:", error);
    throw error;
  }
}

export async function getRecipeById(recipeId) {
  await dbConnect();
  const recipe = await Recipe.findOne({
    recipeId: recipeId,
  }).lean();

  if (!recipe) {
    return null;
  }

  return {
    ...recipe,
    _id: recipe._id.toString(),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };
}

export async function getLatestRecipes(limit = 10) {
  await dbConnect();
  const parsedLimit = Number(limit) || 10;
  try {
    const recipes = await Recipe.find({})
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    return recipes;
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    throw error;
  }
}

export async function updateRecipeAction(prevState, formData) {
  const recipeId = formData.get("recipeId");
  const title = formData.get("title");
  const description = formData.get("description");
  const ingredients = formData.get("ingredients");
  const instructions = formData.get("instructions");
  const category = formData.get("category");
  const imageUrl = formData.get("imageUrl");

  try {
    await dbConnect();

    const recipe = await Recipe.findOne({ recipeId: recipeId });

    if (!recipe) {
      return { status: "Error", message: "Recipe not found" };
    }

    // Check if the current user is the creator of the recipe
    const { userId } = auth();
    if (recipe.userId !== userId) {
      return {
        status: "Error",
        message: "You don't have permission to edit this recipe",
      };
    }

    // Update the recipe
    recipe.title = title;
    recipe.description = description;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.category = category;
    recipe.imageUrl = imageUrl;

    await recipe.save();

    return { status: "Success", message: "Recipe updated successfully" };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return { status: "Error", message: "Failed to update recipe" };
  }
}

export async function toggleBookmark(recipeId, userId) {
  await dbConnect();

  const existingBookmark = await Bookmark.findOne({ recipeId, userId });

  if (existingBookmark) {
    await Bookmark.deleteOne({ _id: existingBookmark._id });
    revalidatePath("/recipes");
    return false; // Bookmark removed
  } else {
    await Bookmark.create({ recipeId, userId });
    revalidatePath("/recipes");
    return true; // Bookmark added
  }
}

export async function isBookmarked(recipeId, userId) {
  await dbConnect();
  const bookmark = await Bookmark.findOne({ recipeId, userId });
  return !!bookmark;
}
