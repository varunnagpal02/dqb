"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CuisineFilterProps {
  cuisines: string[];
  selected: string[];
  onToggle: (cuisine: string) => void;
}

export function CuisineFilter({
  cuisines,
  selected,
  onToggle,
}: CuisineFilterProps) {
  const clearAll = () => {
    // Toggle off each selected cuisine
    selected.forEach((c) => onToggle(c));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={clearAll}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          selected.length === 0
            ? "bg-orange-600 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        All Cuisines
      </button>
      {cuisines.map((cuisine) => (
        <button
          key={cuisine}
          onClick={() => onToggle(cuisine)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selected.includes(cuisine)
              ? "bg-orange-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {cuisine}
        </button>
      ))}
    </div>
  );
}
