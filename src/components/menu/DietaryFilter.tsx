"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DietaryFilterProps {
  filters: {
    vegetarian: boolean;
    vegan: boolean;
    gluten_free: boolean;
    spicy: boolean;
  };
  onToggle: (key: "vegetarian" | "vegan" | "gluten_free" | "spicy") => void;
}

export function DietaryFilter({ filters, onToggle }: DietaryFilterProps) {
  const options = [
    { key: "vegetarian" as const, label: "🥬 Vegetarian", active: filters.vegetarian },
    { key: "vegan" as const, label: "🌱 Vegan", active: filters.vegan },
    { key: "gluten_free" as const, label: "🌾 Gluten-Free", active: filters.gluten_free },
    { key: "spicy" as const, label: "🌶️ Spicy", active: filters.spicy },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onToggle(opt.key)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
            opt.active
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
