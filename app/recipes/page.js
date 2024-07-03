import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getRecentRecipes,
  getRecentFavoriteRecipes,
} from "@/actions/recipeActions";

const placeholderImage = "https://dummyimage.com/600x400/000/fff&text=default";

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.recipeId}`}>
      <Card className="hover:shadow-lg transition-shadow overflow-hidden">
        <div className="flex">
          <CardContent className="flex-1 p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-sm text-gray-500">
              Created on: {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
          <div className="w-1/3 relative">
            <Image
              src={recipe.imageUrl || placeholderImage}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default async function RecipesPage() {
  const recentRecipes = await getRecentRecipes();
  const favoriteRecipes = await getRecentFavoriteRecipes();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Recent Recipes</h2>
          <Link href="/my-recipes">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {recentRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't created any recipes yet.</p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Recent Favorite</h2>
          <Link href="/all-favorites">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            You haven't favorited any recipes yet.
          </p>
        )}
      </section>
    </div>
  );
}
