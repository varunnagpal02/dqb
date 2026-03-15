"use client";

import React from "react";
import { MenuItem as MenuItemType } from "@/types";
import { formatPrice, getDietaryBadges, formatMacro } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Plus, Minus, Flame } from "lucide-react";


interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItemCard({ item }: MenuItemProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((ci) => ci.menu_item.id === item.id);
  const badges = getDietaryBadges(item);

  return (
    <div className="glass-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <span className="text-6xl">
          {item.is_vegetarian ? "🥬" : "🍗"}
        </span>
        {/* Spice level indicator */}
        {item.is_spicy && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Flame className="w-3 h-3" />
            {item.spice_level}/5
          </div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
            >
              {badge.emoji} {badge.label}
            </span>
          ))}
        </div>

        {/* Name & Description */}
        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-1 line-clamp-2">
          {item.description}
        </p>

        {/* Macros */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          <span title="Calories">🔥 {formatMacro(item.calories, "cal")}</span>
          <span title="Protein">💪 {formatMacro(item.protein_g, "g")}</span>
          <span title="Carbs">🌾 {formatMacro(item.carbs_g, "g")}</span>
          <span title="Fat">🧈 {formatMacro(item.fat_g, "g")}</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-orange-600">
            {formatPrice(item.price)}
          </span>

          {item.is_available ? (
            cartItem ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, cartItem.quantity - 1)
                  }
                  className="w-8 h-8 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center hover:bg-orange-600/30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-gray-900 w-6 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, cartItem.quantity + 1)
                  }
                  className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item)}
                className="flex items-center gap-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            )
          ) : (
            <span className="text-sm text-gray-400">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
