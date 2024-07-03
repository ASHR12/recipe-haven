"use client";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchResults from "@/components/SearchResults";
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchRecipes } from "@/actions/searchActions"; // Make sure to create this action
import Pagination from "@/components/Pagination";

const initialState = {
  recipes: [],
  currentPage: 1,
  totalPages: 0,
  totalRecipes: 0,
  error: null,
};

function SubmitButton() {
  return (
    <Button type="submit" className="w-full md:w-auto">
      Search
    </Button>
  );
}

export default function SearchForm() {
  const [state, formAction] = useFormState(searchRecipes, initialState);
  const { isSignedIn } = useUser();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [userFilter, setUserFilter] = useState("none");

  const handleClearAll = (e) => {
    e.preventDefault();
    const form = e.target.form;
    form.reset();
    // Reset select elements
    setCategory("all");
    setSortBy("newest");
    if (isSignedIn) {
      setUserFilter("none");
    }
    // Reset other inputs
    form.querySelector('input[name="query"]').value = "";
    form.querySelector('input[name="dateStart"]').value = "";
    form.querySelector('input[name="dateEnd"]').value = "";
  };

  return (
    <>
      <form
        action={formAction}
        className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto mt-6"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="query" className="text-lg font-semibold">
              Search Recipes
            </Label>
            <Input
              id="query"
              name="query"
              placeholder="Enter recipe name..."
              className="w-full mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="block mb-1">
                Category
              </Label>
              <Select
                name="category"
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortBy" className="block mb-1">
                Sort By
              </Label>
              <Select name="sortBy" value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                  <SelectItem value="z-a">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateStart" className="block mb-1">
              Start Date
            </Label>
            <Input
              type="date"
              id="dateStart"
              name="dateStart"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="dateEnd" className="block mb-1">
              End Date
            </Label>
            <Input type="date" id="dateEnd" name="dateEnd" className="w-full" />
          </div>
        </div>

        {isSignedIn && (
          <div>
            <Label htmlFor="userFilter" className="block mb-1">
              Filter
            </Label>
            <Select
              name="userFilter"
              value={userFilter}
              onValueChange={setUserFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="myRecipes">My Recipes</SelectItem>
                <SelectItem value="myFavorites">My Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <SubmitButton />
          <Button
            type="button"
            variant="outline"
            onClick={handleClearAll}
            className="w-full md:w-auto"
          >
            Clear All
          </Button>
        </div>

        {state.error && <p className="text-red-500">{state.error}</p>}
      </form>
      {state.recipes.length === 0 ? (
        <p className="text-center mt-8">No recipes found.</p>
      ) : (
        state.recipes.length > 0 && (
          <SearchResults
            recipes={state.recipes}
            totalRecipes={state.totalRecipes}
          />
        )
      )}
      {state.totalPages > 1 && (
        <Pagination
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          onPageChange={""}
        />
      )}
    </>
  );
}
