import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getRecipeById } from "@/actions/recipeActions";
import { RecipeActions } from "@/components/RecipeActions";

export default async function RecipePage({ params }) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-2xl sm:text-3xl">{recipe.title}</CardTitle>
          <div className="flex flex-row space-x-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Link href="/recipes" className="flex-grow sm:flex-grow-0">
              <Button variant="outline" size="sm" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Recipes
              </Button>
            </Link>
            <RecipeActions recipe={recipe} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Created on: {new Date(recipe.createdAt).toLocaleDateString()}
          </p>
          {recipe.imageUrl && (
            <div className="mb-6 relative w-full h-[200px] sm:h-[400px] max-w-2xl mx-auto">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg object-contain"
              />
            </div>
          )}
          <p className="mb-4">{recipe.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            Category: {recipe.category}
          </p>
          <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
          <pre className="whitespace-pre-line mb-4 pl-5">
            {recipe.ingredients}
          </pre>
          <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
          <pre className="whitespace-pre-line pl-5">{recipe.instructions}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
