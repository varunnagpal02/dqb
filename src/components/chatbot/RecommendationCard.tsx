"use client";

import React from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice, formatMacro } from "@/lib/utils";
import { Plus, Check } from "lucide-react";

interface RecommendationCardProps {
  item: MenuItem;
}

export default function RecommendationCard({ item }: RecommendationCardProps) {
  const { items, addItem } = useCart();
  const isInCart = items.some((ci) => ci.menu_item.id === item.id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-orange-200 transition-colors">
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">{item.is_vegetarian ? "🥬" : "🍗"}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm truncate">
          {item.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span className="font-semibold text-orange-600">
            {formatPrice(item.price)}
          </span>
          <span>•</span>
          <span>🔥 {formatMacro(item.calories, "cal")}</span>
          <span>•</span>
          <span>💪 {formatMacro(item.protein_g, "g P")}</span>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => !isInCart && addItem(item)}
        disabled={isInCart}
        className={`flex-shrink-0 rounded-full p-2 transition-colors ${
          isInCart
            ? "bg-green-100 text-green-600"
            : "bg-orange-100 text-orange-600 hover:bg-orange-200"
        }`}
      >
        {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
