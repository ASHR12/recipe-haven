"use client";
// components/Navbar.js
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import logo from "@/images/logo/logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState("Navigate");

  const getDisplayName = (path) => {
    switch (path) {
      case "/":
        return "Home";
      case "/discover":
        return "Discover";
      case "/add-recipe":
        return "Add Recipe";
      case "/recipes":
        return "My Recipes";
      case "/search":
        return "Search";
      default:
        return "Navigate";
    }
  };

  useEffect(() => {
    setSelectedOption(getDisplayName(pathname));
  }, [pathname]);

  const handleOptionSelect = (optionName) => {
    setSelectedOption(optionName);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="Recipe Haven Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <span className="sr-only">Recipe Haven</span>
          </Link>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40">
                  {selectedOption} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onSelect={() => handleOptionSelect("Home")}>
                  <Link href="/" className="w-full">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOptionSelect("Discover Recipes")}
                >
                  <Link href="/discover" className="w-full">
                    Discover Recipes
                  </Link>
                </DropdownMenuItem>
                {isSignedIn && (
                  <>
                    <DropdownMenuItem
                      onSelect={() => handleOptionSelect("Add Recipe")}
                    >
                      <Link href="/add-recipe" className="w-full">
                        Add Recipe
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleOptionSelect("My Recipes")}
                    >
                      <Link href="/recipes" className="w-full">
                        My Recipes
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
