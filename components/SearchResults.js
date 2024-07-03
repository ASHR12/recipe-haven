// app/components/SearchResults.jsx
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SearchResults({ recipes, totalRecipes }) {
  return (
    <div className="mt-8 container mx-auto px-4 py-8">
      <p className="text-sm text-gray-500 mb-4">Found {totalRecipes} recipes</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Category: {recipe.category}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={`/recipes/${recipe._id}`} passHref>
                <Button variant="outline">View Recipe</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
