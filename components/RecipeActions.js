"use client";

import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Edit, Bookmark } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "@/actions/recipeActions";

export function RecipeActions({ recipe }) {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [optimisticFavorite, addOptimisticFavorite] = useOptimistic(
    isFavorite,
    (state, newState) => newState
  );

  const isCreator = user?.id === recipe.userId;

  useEffect(() => {
    if (user) {
      isBookmarked(recipe.recipeId, user.id)
        .then((result) => {
          setIsFavorite(result);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error checking bookmark status:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user, recipe.recipeId]);

  const handleFavorite = async () => {
    if (!user) return; // Handle not logged in state

    addOptimisticFavorite(!optimisticFavorite);

    try {
      const result = await toggleBookmark(recipe.recipeId, user.id);
      setIsFavorite(result);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      addOptimisticFavorite(isFavorite); // Revert on error
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <>
      {isCreator && (
        <Link
          href={`/recipes/edit/${recipe.recipeId}`}
          className="flex-grow sm:flex-grow-0"
        >
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        </Link>
      )}
      <Button
        variant={optimisticFavorite ? "default" : "outline"}
        size="sm"
        onClick={handleFavorite}
        className="flex-grow sm:flex-grow-0 w-full"
      >
        <Bookmark
          className={`h-4 w-4 $${optimisticFavorite ? "fill-current" : ""}`}
        />
      </Button>
    </>
  );
}
