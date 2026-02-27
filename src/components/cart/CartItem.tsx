"use client";

import React from "react";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Image placeholder */}
      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">
          {item.menu_item.is_vegetarian ? "🥬" : "🍗"}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{item.menu_item.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {formatPrice(item.menu_item.price)} each
        </p>
        {item.special_instructions && (
          <p className="text-xs text-gray-400 mt-1 italic">
            Note: {item.special_instructions}
          </p>
        )}

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-medium text-gray-900 w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={() => removeItem(item.menu_item.id)}
            className="ml-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0">
        <span className="font-bold text-gray-900">
          {formatPrice(item.menu_item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
