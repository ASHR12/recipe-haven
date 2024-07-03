// app/add-recipe/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { createRecipeAction } from "@/actions/recipeActions"; // You'll need to create this
import { SubmitButton } from "@/components/SubmitButton";

const initialState = {
  errors: [],
  status: "",
  message: "",
};

export default function AddRecipe() {
  const [imageUrl, setImageUrl] = useState("");
  const [state, formAction] = useFormState(createRecipeAction, initialState);
  const router = useRouter();
  useEffect(() => {
    if (state.status === "Error") {
      toast.error(state.message);
    }
    if (state.status === "Success") {
      toast.success(state.message);
      router.push("/recipes");
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>
      <form action={formAction} className="space-y-6">
        <div>
          <Label htmlFor="title">Recipe Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required />
        </div>

        <div>
          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            required
            placeholder="Enter each ingredient on a new line"
          />
        </div>

        <div>
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            name="instructions"
            required
            placeholder="Enter each step on a new line"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Recipe Image</Label>
          <CldUploadButton
            uploadPreset="unsigned_nextjs"
            onSuccess={(result) => {
              setImageUrl(result.info.secure_url);
              toast.success("Image uploaded successfully!");
            }}
            onError={() => toast.error("Image upload failed.")}
          >
            <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer ml-2">
              Upload Image
            </div>
          </CldUploadButton>
          {imageUrl && (
            <p className="mt-2 text-sm text-gray-500">
              Image uploaded: {imageUrl}
            </p>
          )}
        </div>

        <input type="hidden" name="imageUrl" value={imageUrl} />

        {state.errors && state.errors.length > 0 && (
          <ul className="text-red-500">
            {state.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-6">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
