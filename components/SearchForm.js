import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Searching..." : "Search"}
    </Button>
  );
}

export default function SearchForm({ searchParams, onClearAll }) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <Label htmlFor="query">Search Recipes</Label>
          <Input
            id="query"
            name="query"
            placeholder="Enter recipe name..."
            defaultValue={searchParams.query}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            name="category"
            defaultValue={searchParams.category}
          >
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="sortBy">Sort By</Label>
          <Select id="sortBy" name="sortBy" defaultValue={searchParams.sortBy}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateStart">Start Date</Label>
          <Input
            type="date"
            id="dateStart"
            name="dateStart"
            defaultValue={searchParams.dateStart}
          />
        </div>
        <div>
          <Label htmlFor="dateEnd">End Date</Label>
          <Input
            type="date"
            id="dateEnd"
            name="dateEnd"
            defaultValue={searchParams.dateEnd}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="myRecipes"
            name="myRecipes"
            defaultChecked={searchParams.myRecipes}
          />
          <Label htmlFor="myRecipes">My Recipes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="myFavorites"
            name="myFavorites"
            defaultChecked={searchParams.myFavorites}
          />
          <Label htmlFor="myFavorites">My Favorites</Label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <SubmitButton />
        <Button
          type="button"
          variant="outline"
          onClick={onClearAll}
          className="w-full sm:w-auto"
        >
          Clear All
        </Button>
      </div>
    </form>
  );
}
