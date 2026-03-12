"use client";

import { useState, useMemo } from "react";
import { Plus, ShoppingCart, Check, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { menuItems, SeedMenuItem } from "@/data/seed-menu";
import { useCart } from "@/hooks/useCart";
import { MenuItem } from "@/types";

// ============================================
// Helpers
// ============================================

function toMenuItem(item: SeedMenuItem): MenuItem {
  const id = item.name.toLowerCase().replace(/\s+/g, "-");
  return {
    id,
    category_id: item.category_slug,
    name: item.name,
    description: item.description,
    price: item.price,
    image_url: null,
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
    mood_tags: item.mood_tags,
    keywords: item.keywords,
    is_available: true,
    is_active: true,
    sort_order: item.sort_order,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

type DietType = "vegetarian" | "vegan" | "combination" | "meat";
type PriceTier = "budget" | "standard" | "premium";

interface PreMadePlan {
  id: string;
  name: string;
  diet: DietType;
  tier: PriceTier;
  tierLabel: string;
  priceLabel: string;
  description: string;
  emoji: string;
  weeklyItems: SeedMenuItem[];
  weeklyTotal: number;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function filterByDiet(items: SeedMenuItem[], diet: DietType): SeedMenuItem[] {
  switch (diet) {
    case "vegetarian":
      return items.filter((i) => i.is_vegetarian);
    case "vegan":
      return items.filter((i) => i.is_vegan);
    case "meat":
      return items.filter((i) => !i.is_vegetarian);
    case "combination":
    default:
      return items;
  }
}

// Pick items for a weekly plan within a budget, ensuring variety
function buildWeeklyPlan(
  pool: SeedMenuItem[],
  targetBudget: number,
  mealsPerDay: number
): SeedMenuItem[] {
  const totalMeals = 7 * mealsPerDay;
  const perMealBudget = targetBudget / totalMeals;

  // Sort by price to get items in budget range
  const affordable = pool
    .filter((i) => i.price <= perMealBudget * 1.5)
    .filter((i) => !i.category_slug.startsWith("b-") && !i.category_slug.startsWith("d-"));

  if (affordable.length === 0) return [];

  // Shuffle for variety
  const shuffled = [...affordable].sort(() => Math.random() - 0.5);

  const selected: SeedMenuItem[] = [];
  let spent = 0;

  for (let i = 0; i < totalMeals; i++) {
    const item = shuffled[i % shuffled.length];
    if (spent + item.price <= targetBudget * 1.15) {
      selected.push(item);
      spent += item.price;
    } else {
      // pick cheapest
      const cheapest = affordable.reduce((a, b) => (a.price < b.price ? a : b));
      selected.push(cheapest);
      spent += cheapest.price;
    }
  }

  return selected;
}

function generatePreMadePlans(): PreMadePlan[] {
  const diets: { type: DietType; label: string; emoji: string }[] = [
    { type: "vegetarian", label: "Vegetarian", emoji: "🥬" },
    { type: "vegan", label: "Vegan", emoji: "🌱" },
    { type: "combination", label: "Combination", emoji: "🍱" },
    { type: "meat", label: "Meat Lovers", emoji: "🍗" },
  ];

  const tiers: { tier: PriceTier; label: string; priceLabel: string; target: number }[] = [
    { tier: "budget", label: "Budget", priceLabel: "Under $60/week", target: 55 },
    { tier: "standard", label: "Standard", priceLabel: "Under $80/week", target: 75 },
    { tier: "premium", label: "Premium", priceLabel: "$80+/week", target: 100 },
  ];

  const plans: PreMadePlan[] = [];

  for (const diet of diets) {
    const pool = filterByDiet(menuItems, diet.type);
    for (const tier of tiers) {
      const mealsPerDay = tier.tier === "budget" ? 2 : tier.tier === "standard" ? 2 : 3;
      const weeklyItems = buildWeeklyPlan(pool, tier.target, mealsPerDay);
      const weeklyTotal = weeklyItems.reduce((sum, i) => sum + i.price, 0);

      plans.push({
        id: `${diet.type}-${tier.tier}`,
        name: `${diet.label} ${tier.label}`,
        diet: diet.type,
        tier: tier.tier,
        tierLabel: tier.label,
        priceLabel: tier.priceLabel,
        description: `A ${tier.label.toLowerCase()} ${diet.label.toLowerCase()} meal plan with ${mealsPerDay} meals/day.`,
        emoji: diet.emoji,
        weeklyItems,
        weeklyTotal: Math.round(weeklyTotal * 100) / 100,
      });
    }
  }

  return plans;
}

// ============================================
// Components
// ============================================

function PlanCard({ plan, onAddAll }: { plan: PreMadePlan; onAddAll: (items: SeedMenuItem[]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const { items: cartItems } = useCart();

  const dailyMeals = useMemo(() => {
    const mealsPerDay = plan.weeklyItems.length / 7;
    return DAYS.map((day, i) => ({
      day,
      meals: plan.weeklyItems.slice(i * mealsPerDay, (i + 1) * mealsPerDay),
    }));
  }, [plan.weeklyItems]);

  const tierColorMap = {
    budget: "border-green-200 bg-green-50",
    standard: "border-blue-200 bg-blue-50",
    premium: "border-purple-200 bg-purple-50",
  };

  const tierBadgeMap = {
    budget: "bg-green-100 text-green-700",
    standard: "bg-blue-100 text-blue-700",
    premium: "bg-purple-100 text-purple-700",
  };

  const allInCart = plan.weeklyItems.length > 0 && plan.weeklyItems.every((item) => {
    const id = item.name.toLowerCase().replace(/\s+/g, "-");
    return cartItems.some((ci) => ci.menu_item.id === id);
  });

  return (
    <div className={`rounded-xl border-2 ${tierColorMap[plan.tier]} overflow-hidden transition-all hover:shadow-lg`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-3xl">{plan.emoji}</span>
            <h3 className="text-lg font-bold text-gray-900 mt-2">{plan.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierBadgeMap[plan.tier]}`}>
            {plan.priceLabel}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">${plan.weeklyTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500">per week</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">{plan.weeklyItems.length}</p>
            <p className="text-xs text-gray-500">meals</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">
              {Math.round(plan.weeklyItems.reduce((s, i) => s + i.calories, 0) / 7)}
            </p>
            <p className="text-xs text-gray-500">avg cal/day</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAddAll(plan.weeklyItems)}
            disabled={allInCart}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              allInCart
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            {allInCart ? (
              <>
                <Check className="w-4 h-4" /> All in Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add All to Cart
              </>
            )}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Weekly Breakdown</h4>
          <div className="space-y-3">
            {dailyMeals.map((day) => (
              <div key={day.day}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{day.day}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {day.meals.map((meal, idx) => (
                    <span
                      key={`${day.day}-${idx}`}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                    >
                      {meal.name} · ${meal.price.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomPlanBuilder() {
  const { items: cartItems, addItem } = useCart();
  const [dietFilter, setDietFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customItems, setCustomItems] = useState<SeedMenuItem[]>([]);
  const [showMenu, setShowMenu] = useState(true);

  const filteredMenu = useMemo(() => {
    let pool = menuItems.filter(
      (i) => !i.category_slug.startsWith("b-") && !i.category_slug.startsWith("d-")
    );
    if (dietFilter === "vegetarian") pool = pool.filter((i) => i.is_vegetarian);
    if (dietFilter === "vegan") pool = pool.filter((i) => i.is_vegan);
    if (dietFilter === "meat") pool = pool.filter((i) => !i.is_vegetarian);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (i) => i.name.toLowerCase().includes(q) || i.keywords.some((k) => k.includes(q))
      );
    }
    return pool;
  }, [dietFilter, searchQuery]);

  const weeklyTotal = useMemo(
    () => customItems.reduce((sum, i) => sum + i.price, 0),
    [customItems]
  );

  const avgCalPerDay = useMemo(
    () => (customItems.length > 0 ? Math.round(customItems.reduce((sum, i) => sum + i.calories, 0) / 7) : 0),
    [customItems]
  );

  const addToCustomPlan = (item: SeedMenuItem) => {
    setCustomItems((prev) => [...prev, item]);
  };

  const removeFromCustomPlan = (index: number) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addAllToCart = () => {
    const uniqueItems = new Map<string, SeedMenuItem>();
    customItems.forEach((item) => {
      const id = item.name.toLowerCase().replace(/\s+/g, "-");
      uniqueItems.set(id, item);
    });
    uniqueItems.forEach((item) => {
      const mi = toMenuItem(item);
      const count = customItems.filter((ci) => ci.name === item.name).length;
      const inCart = cartItems.find((ci) => ci.menu_item.id === mi.id);
      if (!inCart) {
        addItem(mi, count);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Custom Plan Summary */}
      <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">🛠️ Your Custom Meal Plan</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add meals from the menu below. Aim for 14-21 meals for a full week.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">${weeklyTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{customItems.length} meals · {avgCalPerDay} avg cal/day</p>
          </div>
        </div>

        {customItems.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {customItems.map((item, idx) => (
                <span
                  key={`custom-${idx}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-sm text-gray-700"
                >
                  {item.is_vegetarian ? "🥬" : "🍗"} {item.name} · ${item.price.toFixed(2)}
                  <button
                    onClick={() => removeFromCustomPlan(idx)}
                    className="ml-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addAllToCart}
                className="flex items-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> Add All to Cart
              </button>
              <button
                onClick={() => setCustomItems([])}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear Plan
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-lg">No meals added yet</p>
            <p className="text-sm mt-1">Browse the menu below or <button onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))} className="text-orange-600 hover:underline font-medium">ask our AI chatbot</button> for suggestions</p>
          </div>
        )}
      </div>

      {/* Menu Browser */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-bold text-gray-900">📋 Browse Menu</h3>
          {showMenu ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showMenu && (
          <div className="border-t border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "vegetarian", label: "🥬 Veg" },
                  { value: "vegan", label: "🌱 Vegan" },
                  { value: "meat", label: "🍗 Meat" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDietFilter(opt.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dietFilter === opt.value
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
              {filteredMenu.map((item) => {
                const id = item.name.toLowerCase().replace(/\s+/g, "-");
                const inCart = cartItems.some((ci) => ci.menu_item.id === id);
                const countInPlan = customItems.filter((ci) => ci.name === item.name).length;

                return (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      countInPlan > 0 ? "border-orange-300 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.is_vegetarian ? "🥬" : "🍗"}</span>
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-orange-600">${item.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{item.calories} cal</span>
                        {inCart && <span className="text-xs text-green-600 font-medium">In cart</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {countInPlan > 0 && (
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                          ×{countInPlan}
                        </span>
                      )}
                      <button
                        onClick={() => addToCustomPlan(item)}
                        className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                        title="Add to meal plan"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredMenu.length === 0 && (
                <p className="col-span-full text-center py-8 text-gray-400 text-sm">
                  No items match your filters
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Page
// ============================================

export default function MealPlansPage() {
  const [activeTab, setActiveTab] = useState<"premade" | "custom">("premade");
  const [dietFilter, setDietFilter] = useState<DietType | "all">("all");
  const [tierFilter, setTierFilter] = useState<PriceTier | "all">("all");
  const { addItem } = useCart();

  const plans = useMemo(() => generatePreMadePlans(), []);

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      if (dietFilter !== "all" && p.diet !== dietFilter) return false;
      if (tierFilter !== "all" && p.tier !== tierFilter) return false;
      return true;
    });
  }, [plans, dietFilter, tierFilter]);

  const handleAddAll = (items: SeedMenuItem[]) => {
    // Deduplicate and add each unique item
    const uniqueItems = new Map<string, { item: SeedMenuItem; count: number }>();
    items.forEach((item) => {
      const id = item.name.toLowerCase().replace(/\s+/g, "-");
      const existing = uniqueItems.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        uniqueItems.set(id, { item, count: 1 });
      }
    });
    uniqueItems.forEach(({ item, count }) => {
      addItem(toMenuItem(item), count);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          🍱 Meal Plans
        </h1>
        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          Choose a pre-made weekly meal plan or build your own. All plans use our clean, organic, seed-oil-free ingredients.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("premade")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "premade"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📦 Pre-Made Plans
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "custom"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🛠️ Build Your Own
          </button>
        </div>
      </div>

      {activeTab === "premade" ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 self-center mr-1">Diet:</span>
              {(["all", "vegetarian", "vegan", "combination", "meat"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDietFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    dietFilter === d
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {d === "all" ? "All" : d === "vegetarian" ? "🥬 Vegetarian" : d === "vegan" ? "🌱 Vegan" : d === "combination" ? "🍱 Combo" : "🍗 Meat"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 self-center mr-1">Budget:</span>
              {(["all", "budget", "standard", "premium"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    tierFilter === t
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t === "all" ? "All" : t === "budget" ? "💚 Under $60" : t === "standard" ? "💙 Under $80" : "💜 $80+"}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onAddAll={handleAddAll} />
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No plans match your filters</p>
              <button
                onClick={() => { setDietFilter("all"); setTierFilter("all"); }}
                className="mt-2 text-orange-600 hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      ) : (
        <CustomPlanBuilder />
      )}

      {/* AI Chat CTA */}
      <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900">🤖 Need Help Choosing?</h3>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Our AI chatbot can create a personalized meal plan based on your dietary preferences, budget, and fitness goals.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
          className="mt-4 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          💬 Ask AI for a Plan
        </button>
      </div>
    </div>
  );
}
