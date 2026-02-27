"use client";

import React from "react";
import { MenuItem as MenuItemType } from "@/types";
import MenuItemCard from "./MenuItem";

interface MenuGridProps {
  items: MenuItemType[];
  emptyMessage?: string;
}

export function MenuGrid({ items, emptyMessage = "No items found" }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl mb-4 block">🍽️</span>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
