// app/page.js
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getLatestRecipes } from "@/actions/recipeActions";

export default async function Home() {
  const latestRecipes = await getLatestRecipes(10);

  return (
    <div className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <div className="smoke-effect"></div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-white">
            Welcome to Recipe Haven
          </h1>
          <p className="text-2xl mb-8 text-gray-300">
            Discover, share, and create delicious recipes
          </p>
          <Link href="/discover">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Discover Recipes
            </Button>
          </Link>
        </div>
        <div className="mt-16 mb-16">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {latestRecipes.map((recipe) => (
                <CarouselItem
                  key={recipe.recipeId}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Link href={`/recipes/${recipe.recipeId}`}>
                    <div className="p-1">
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48 shadow-lg"
                      />
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {recipe.title}
                      </h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
