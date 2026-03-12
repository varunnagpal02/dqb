"use client";

import React from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice, formatMacro } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface RecommendationCardProps {
  item: MenuItem;
}

export default function RecommendationCard({ item }: RecommendationCardProps) {
  const { items, addItem, removeItem } = useCart();
  const cartItem = items.find((ci) => ci.menu_item.id === item.id);
  const isInCart = !!cartItem;

  const handleToggle = () => {
    if (isInCart) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <div className={`bg-white border rounded-xl p-3 flex items-center gap-3 transition-colors ${
      isInCart ? "border-green-300 bg-green-50/30" : "border-gray-200 hover:border-orange-200"
    }`}>
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
        {isInCart && (
          <span className="text-xs text-green-600 font-medium mt-0.5 inline-block">
            ✓ In cart{cartItem.quantity > 1 ? ` (×${cartItem.quantity})` : ""}
          </span>
        )}
      </div>

      {/* Toggle button: Add or Remove */}
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 rounded-full p-2 transition-colors ${
          isInCart
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-orange-100 text-orange-600 hover:bg-orange-200"
        }`}
        title={isInCart ? "Remove from cart" : "Add to cart"}
      >
        {isInCart ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
