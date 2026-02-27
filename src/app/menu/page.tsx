"use client";

import { useState, useMemo } from "react";
import { menuItems, cuisines, categories } from "@/data/seed-menu";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { CuisineFilter } from "@/components/menu/CuisineFilter";
import { DietaryFilter } from "@/components/menu/DietaryFilter";
import { Input } from "@/components/ui/Input";
import type { MenuItem } from "@/types";

// Build a lookup: category_slug -> cuisine_slug
const categoryToCuisine: Record<string, string> = {};
categories.forEach((cat) => {
  categoryToCuisine[cat.slug] = cat.cuisine_slug;
});

// Build a lookup: cuisine_slug -> cuisine_name
const cuisineSlugToName: Record<string, string> = {};
cuisines.forEach((c) => {
  cuisineSlugToName[c.slug] = c.name;
});

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    gluten_free: false,
    spicy: false,
  });
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "calories">("default");

  const cuisineNames = cuisines.map((c) => c.name);

  const filteredItems = useMemo(() => {
    let items: MenuItem[] = menuItems.map((item, index) => ({
      id: `item-${index}`,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: null,
      category_id: item.category_slug,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      is_spicy: item.is_spicy,
      spice_level: item.spice_level,
      calories: item.calories,
      protein_g: item.protein_g,
      carbs_g: item.carbs_g,
      fat_g: item.fat_g,
      fiber_g: item.fiber_g,
      is_available: true,
      is_active: true,
      sort_order: index,
      mood_tags: item.mood_tags,
      keywords: item.keywords,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    }

    // Cuisine filter
    if (selectedCuisines.length > 0) {
      items = items.filter((item) => {
        const cuisineName = cuisineSlugToName[categoryToCuisine[item.category_id]] || "";
        return selectedCuisines.some(
          (c) => c.toLowerCase() === cuisineName.toLowerCase()
        );
      });
    }

    // Dietary filters
    if (dietaryFilters.vegetarian) {
      items = items.filter((item) => item.is_vegetarian);
    }
    if (dietaryFilters.vegan) {
      items = items.filter((item) => item.is_vegan);
    }
    if (dietaryFilters.gluten_free) {
      items = items.filter((item) => item.is_gluten_free);
    }
    if (dietaryFilters.spicy) {
      items = items.filter((item) => item.spice_level >= 3);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "calories":
        items.sort((a, b) => (a.calories || 0) - (b.calories || 0));
        break;
    }

    return items;
  }, [search, selectedCuisines, dietaryFilters, sortBy]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleDietary = (key: keyof typeof dietaryFilters) => {
    setDietaryFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
        <p className="mt-2 text-gray-500">
          Explore {menuItems.length}+ authentic Indian dishes. Filter by cuisine, diet, or search for your favorites.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Search dishes, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cuisine Pills */}
        <CuisineFilter
          cuisines={cuisineNames}
          selected={selectedCuisines}
          onToggle={toggleCuisine}
        />

        {/* Dietary + Sort Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DietaryFilter filters={dietaryFilters} onToggle={toggleDietary} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="calories">Calories: Low → High</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredItems.length} of {menuItems.length} items
      </p>

      {/* Menu Grid */}
      <MenuGrid items={filteredItems} />
    </div>
  );
}
