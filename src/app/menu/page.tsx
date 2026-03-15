"use client";

import { useState, useMemo, useCallback } from "react";
import { menuItems, cuisines, categories } from "@/data/seed-menu";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { DietaryFilter } from "@/components/menu/DietaryFilter";
import { Search, Sparkles, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { MenuItem } from "@/types";

// Build lookups
const categoryToCuisine: Record<string, string> = {};
categories.forEach((cat) => {
  categoryToCuisine[cat.slug] = cat.cuisine_slug;
});
const cuisineSlugToName: Record<string, string> = {};
cuisines.forEach((c) => {
  cuisineSlugToName[c.slug] = c.name;
});

// Quick Nav categories
const QUICK_NAV = [
  { id: "deals", label: "Deals", emoji: "🏷️", type: "mood" as const, value: "deal" },
  { id: "breakfast", label: "Breakfast", emoji: "🌅", type: "mood" as const, value: "breakfast" },
  { id: "lunch", label: "Lunch", emoji: "🍛", type: "mood" as const, value: "lunch" },
  { id: "dinner", label: "Dinner", emoji: "🌙", type: "mood" as const, value: "dinner" },
  { id: "appetizers", label: "Appetizers", emoji: "🥘", type: "category" as const, value: "ni-starters,ic-starters,sf-chaat" },
  { id: "mains", label: "Mains", emoji: "🍲", type: "category" as const, value: "ni-main-course,si-mains,ic-noodles-rice" },
  { id: "breads", label: "Breads", emoji: "🫓", type: "category" as const, value: "ni-breads" },
  { id: "drinks", label: "Drinks", emoji: "🥤", type: "category" as const, value: "b-hot,b-cold" },
  { id: "north-indian", label: "North Indian", emoji: "🍛", type: "cuisine" as const, value: "north-indian" },
  { id: "south-indian", label: "South Indian", emoji: "🥘", type: "cuisine" as const, value: "south-indian" },
  { id: "indo-chinese", label: "Indo-Chinese", emoji: "🥡", type: "cuisine" as const, value: "indo-chinese" },
  { id: "street-food", label: "Street Food", emoji: "🍢", type: "cuisine" as const, value: "street-food" },
  { id: "desserts", label: "Desserts", emoji: "🍮", type: "cuisine" as const, value: "desserts" },
  { id: "meal-plans", label: "Meal Plans", emoji: "📋", type: "link" as const, value: "/meal-plans" },
];

// Smart search detection
function isSmartQuery(q: string): boolean {
  const smartPatterns = /(\$|under|below|above|budget|cheap|expensive|protein|calories?|carbs?|fat|macro|low.?cal|high.?protein|healthy|light|heavy|filling|comfort)/i;
  return smartPatterns.test(q);
}

// Convert seed items to MenuItem
function toMenuItem(item: (typeof menuItems)[0], index: number): MenuItem {
  return {
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
    is_recommended: item.is_recommended || false,
    sort_order: index,
    mood_tags: item.mood_tags,
    keywords: item.keywords,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

const allMenuItems = menuItems.map(toMenuItem);

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    gluten_free: false,
    spicy: false,
  });
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc" | "calories" | "protein-desc">("recommended");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [maxCalories, setMaxCalories] = useState<string>("");
  const [maxSpiceLevel, setMaxSpiceLevel] = useState<number>(5);
  const [showFilters, setShowFilters] = useState(false);

  // AI search state
  const [aiSearching, setAiSearching] = useState(false);
  const [aiFilters, setAiFilters] = useState<Record<string, unknown> | null>(null);
  const [aiMessage, setAiMessage] = useState("");

  const handleSmartSearch = useCallback(async (query: string) => {
    if (!isSmartQuery(query)) {
      setAiFilters(null);
      setAiMessage("");
      return;
    }
    setAiSearching(true);
    try {
      const res = await fetch("/api/menu-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.filters) {
        setAiFilters(data.filters);
        setAiMessage(data.message || "");
      }
    } catch {
      // Fall back to text search
    }
    setAiSearching(false);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) handleSmartSearch(search);
  };

  const clearAiSearch = () => {
    setAiFilters(null);
    setAiMessage("");
    setSearch("");
  };

  // Quick nav toggle
  const toggleNav = (id: string) => {
    setActiveNav((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  // Filter logic
  const filteredItems = useMemo(() => {
    let items = [...allMenuItems];

    // AI filters take priority
    if (aiFilters) {
      const f = aiFilters;
      if (f.query_text && typeof f.query_text === "string" && f.query_text.trim()) {
        const q = (f.query_text as string).toLowerCase();
        const matched = items.filter(
          (i) => i.name.toLowerCase().includes(q) ||
            (i.description && i.description.toLowerCase().includes(q)) ||
            i.keywords.some((k) => k.toLowerCase().includes(q))
        );
        if (matched.length > 0) items = matched;
      }
      if (f.cuisine && typeof f.cuisine === "string") {
        const cf = items.filter((i) => {
          const cs = categoryToCuisine[i.category_id] || "";
          return cs.toLowerCase().includes((f.cuisine as string).toLowerCase());
        });
        if (cf.length > 0) items = cf;
      }
      if (f.is_vegetarian === true) items = items.filter((i) => i.is_vegetarian);
      if (f.is_vegan === true) items = items.filter((i) => i.is_vegan);
      if (f.is_gluten_free === true) items = items.filter((i) => i.is_gluten_free);
      const mp = (f.max_price ?? f.budget_max) as number | null;
      if (typeof mp === "number" && mp > 0) items = items.filter((i) => i.price <= mp);
      if (typeof f.max_calories === "number") items = items.filter((i) => (i.calories || 999) <= (f.max_calories as number));
      if (typeof f.min_protein === "number") items = items.filter((i) => (i.protein_g || 0) >= (f.min_protein as number));
      if (typeof f.max_carbs === "number") items = items.filter((i) => (i.carbs_g || 999) <= (f.max_carbs as number));
      if (typeof f.max_fat === "number") items = items.filter((i) => (i.fat_g || 999) <= (f.max_fat as number));
      if (f.spice_level === "mild") items = items.filter((i) => i.spice_level <= 1);
      else if (f.spice_level === "medium") items = items.filter((i) => i.spice_level >= 2 && i.spice_level <= 3);
      else if (f.spice_level === "hot") items = items.filter((i) => i.spice_level >= 4);
      if (Array.isArray(f.mood) && (f.mood as string[]).length > 0) {
        const mf = items.filter((i) =>
          i.mood_tags.some((t) => (f.mood as string[]).some((m) => m.toLowerCase() === t.toLowerCase()))
        );
        if (mf.length > 0) items = mf;
      }
      return items;
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          i.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Quick nav filters
    if (activeNav.length > 0) {
      const navConfigs = activeNav.map((id) => QUICK_NAV.find((n) => n.id === id)).filter(Boolean);
      if (navConfigs.length > 0) {
        items = items.filter((item) => {
          return navConfigs.some((nav) => {
            if (!nav) return false;
            if (nav.type === "mood") {
              return item.mood_tags.includes(nav.value);
            }
            if (nav.type === "category") {
              const cats = nav.value.split(",");
              return cats.includes(item.category_id);
            }
            if (nav.type === "cuisine") {
              const cs = categoryToCuisine[item.category_id] || "";
              return cs === nav.value;
            }
            return false;
          });
        });
      }
    }

    // Dietary filters
    if (dietaryFilters.vegetarian) items = items.filter((i) => i.is_vegetarian);
    if (dietaryFilters.vegan) items = items.filter((i) => i.is_vegan);
    if (dietaryFilters.gluten_free) items = items.filter((i) => i.is_gluten_free);
    if (dietaryFilters.spicy) items = items.filter((i) => i.spice_level >= 3);

    // Price filter
    const mp = parseFloat(maxPrice);
    if (!isNaN(mp) && mp > 0) items = items.filter((i) => i.price <= mp);

    // Calorie filter
    const mc = parseFloat(maxCalories);
    if (!isNaN(mc) && mc > 0) items = items.filter((i) => (i.calories || 999) <= mc);

    // Spice level filter
    if (maxSpiceLevel < 5) items = items.filter((i) => i.spice_level <= maxSpiceLevel);

    // Sort
    switch (sortBy) {
      case "recommended":
        items.sort((a, b) => {
          if (a.is_recommended && !b.is_recommended) return -1;
          if (!a.is_recommended && b.is_recommended) return 1;
          return a.sort_order - b.sort_order;
        });
        break;
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "calories":
        items.sort((a, b) => (a.calories || 0) - (b.calories || 0));
        break;
      case "protein-desc":
        items.sort((a, b) => (b.protein_g || 0) - (a.protein_g || 0));
        break;
    }

    return items;
  }, [search, activeNav, dietaryFilters, sortBy, maxPrice, maxCalories, maxSpiceLevel, aiFilters]);

  // Recommended items
  const recommendedItems = useMemo(() => {
    return allMenuItems.filter((i) => i.is_recommended);
  }, []);

  const toggleDietary = (key: keyof typeof dietaryFilters) => {
    setDietaryFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showRecommended = !search && activeNav.length === 0 && !aiFilters && sortBy === "recommended";
  const hasActiveFilters = maxPrice || maxCalories || maxSpiceLevel < 5 || activeNav.length > 0;

  return (
    <div className="min-h-screen relative">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-32 w-[350px] h-[350px] bg-amber-100/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-12">
        {/* Search bar — top priority */}
        <form onSubmit={handleSearchSubmit} className="mb-5">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder='Search dishes, or try "vegan under $12", "high protein meals"...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value.trim()) clearAiSearch();
              }}
              className="w-full pl-14 pr-28 py-4 glass-input rounded-2xl text-base"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {(search || aiFilters) && (
                <button
                  type="button"
                  onClick={clearAiSearch}
                  className="p-1.5 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={aiSearching || !search.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiSearching ? "..." : "AI Search"}
              </button>
            </div>
          </div>
          {aiMessage && (
            <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 glass-card-light px-4 py-2.5 max-w-3xl mx-auto">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{aiMessage}</span>
            </div>
          )}
        </form>

        {/* Quick Nav Bar */}
        <div className="mb-5 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {QUICK_NAV.map((nav) =>
              nav.type === "link" ? (
                <Link
                  key={nav.id}
                  href={nav.value}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition-all whitespace-nowrap"
                >
                  <span>{nav.emoji}</span>
                  <span>{nav.label}</span>
                </Link>
              ) : (
                <button
                  key={nav.id}
                  onClick={() => toggleNav(nav.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeNav.includes(nav.id)
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 border border-orange-500/50"
                      : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <span>{nav.emoji}</span>
                  <span>{nav.label}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Filters & Sort row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <DietaryFilter filters={dietaryFilters} onToggle={toggleDietary} />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                showFilters || hasActiveFilters
                  ? "bg-orange-50 text-orange-600 border-orange-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="glass-input px-4 py-2.5 rounded-xl text-sm [&>option]:bg-white [&>option]:text-gray-700"
          >
            <option value="recommended">⭐ Recommended</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="calories">Calories: Low → High</option>
            <option value="protein-desc">Protein: High → Low</option>
          </select>
        </div>

        {/* Expandable advanced filters */}
        {showFilters && (
          <div className="glass-card p-4 mb-5 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Max Price</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="$"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 px-3 py-2 glass-input rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Max Cal</label>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="cal"
                value={maxCalories}
                onChange={(e) => setMaxCalories(e.target.value)}
                className="w-20 px-3 py-2 glass-input rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Spice ≤</label>
              <select
                value={maxSpiceLevel}
                onChange={(e) => setMaxSpiceLevel(parseInt(e.target.value))}
                className="glass-input px-3 py-2 rounded-lg text-sm [&>option]:bg-white [&>option]:text-gray-700"
              >
                <option value={5}>Any</option>
                <option value={0}>None (0)</option>
                <option value={1}>Mild (1)</option>
                <option value={2}>Medium (2)</option>
                <option value={3}>Hot (3)</option>
                <option value={4}>Very Hot (4)</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setMaxPrice("");
                  setMaxCalories("");
                  setMaxSpiceLevel(5);
                  setActiveNav([]);
                }}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Recommended Section */}
        {showRecommended && recommendedItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              ⭐ Recommended for You
            </h2>
            <MenuGrid items={recommendedItems} />
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"} found
          </p>
        </div>

        {/* Menu Grid */}
        <MenuGrid
          items={filteredItems}
          emptyMessage="No dishes match your filters. Try adjusting your search or filters."
        />
      </div>
    </div>
  );
}
