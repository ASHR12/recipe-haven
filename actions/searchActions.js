// app/actions/searchActions.js
"use server";

import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Recipe from "@/models/Recipe";
import Bookmark from "@/models/Bookmark";

export async function searchRecipes(prevState, formData) {
  const { userId } = auth();
  // if (!userId) {
  //   return { ...prevState, error: "User not authenticated" };
  // }

  await dbConnect();

  const query = formData.get("query");
  const category = formData.get("category");
  const dateStart = formData.get("dateStart");
  const dateEnd = formData.get("dateEnd");
  const sortBy = formData.get("sortBy");
  const page = parseInt(formData.get("page") || "1");
  const limit = 9;

  const userFilter = formData.get("userFilter");

  let myRecipes = false;
  let myFavorites = false;

  if (userFilter === "myRecipes") {
    myRecipes = true;
  } else if (userFilter === "myFavorites") {
    myFavorites = true;
  } else if (userFilter === "none") {
    myRecipes = false;
    myFavorites = false;
  }

  let filter = {};
  if (query) filter.title = { $regex: query, $options: "i" };
  if (category && category !== "all") filter.category = category;
  if (dateStart || dateEnd) {
    filter.createdAt = {};
    if (dateStart) filter.createdAt.$gte = new Date(dateStart);
    if (dateEnd) filter.createdAt.$lte = new Date(dateEnd);
  }
  if (myRecipes) filter.userId = userId;
  if (myFavorites) {
    const bookmarks = await Bookmark.find({ userId });
    const bookmarkedRecipeIds = bookmarks.map((b) => b.recipeId);
    filter.recipeId = { $in: bookmarkedRecipeIds };
  }

  const sortOptions = {
    "a-z": { title: 1 },
    "z-a": { title: -1 },
    oldest: { createdAt: 1 },
    newest: { createdAt: -1 },
  };

  try {
    const totalRecipes = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(totalRecipes / limit);
    const recipes = await Recipe.find(filter)
      .sort(sortOptions[sortBy] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    // console.log("Recipes found:", recipes);
    // Convert MongoDB documents to plain objects
    const plainRecipes = recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    }));

    return {
      recipes: plainRecipes,
      currentPage: page,
      totalPages,
      totalRecipes,
      searchParams: {
        query,
        category,
        dateStart,
        dateEnd,
        myRecipes,
        myFavorites,
        sortBy,
      },
      error: null,
    };
  } catch (error) {
    console.error("Search error:", error);
    return { ...prevState, error: "Failed to search recipes" };
  }
}
