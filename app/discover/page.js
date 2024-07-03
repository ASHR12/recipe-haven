import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestRecipes } from "@/actions/recipeActions";

function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.recipeId}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-48 mb-4">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <p className="text-sm text-gray-500">
            Created on: {new Date(recipe.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function DiscoverPage() {
  const latestRecipes = await getLatestRecipes(10); // Fetch 10 latest recipes

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Latest Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestRecipes.map((recipe) => (
          <RecipeCard key={recipe.recipeId} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
