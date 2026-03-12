"use client";

import Link from "next/link";
import { cuisines, menuItems } from "@/data/seed-menu";

export default function HomePage() {
  const featured = menuItems.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Flavors that feel{" "}
              <span className="text-yellow-200">like home</span> 🍛
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-orange-100 leading-relaxed">
              Authentic Indian cuisine made with <strong>clean, organic ingredients</strong> — no seed oils, no shortcuts.
              Powered by AI to match your mood, diet, budget, or macros.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors shadow-lg"
              >
                Browse Menu
              </Link>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
                className="inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                🤖 Ask AI Bot
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto fill-gray-50">
            <path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,64L1360,64C1280,64,1120,64,960,64C800,64,640,64,480,64C320,64,160,64,80,64L0,64Z" />
          </svg>
        </div>
      </section>

      {/* Cuisine Showcase */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Our Cuisines</h2>
            <p className="mt-3 text-gray-500">From North Indian classics to street food favorites</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cuisines.map((cuisine) => (
              <Link
                key={cuisine.slug}
                href={`/menu?cuisine=${cuisine.slug}`}
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <span className="text-4xl mb-3">
                  {cuisine.slug === "north-indian" ? "🍛" : cuisine.slug === "south-indian" ? "🥘" : cuisine.slug === "indo-chinese" ? "🥡" : cuisine.slug === "street-food" ? "🌮" : cuisine.slug === "desserts" ? "🍮" : "🥤"}
                </span>
                <span className="font-medium text-gray-800 text-sm text-center group-hover:text-orange-600 transition-colors">
                  {cuisine.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meal Plans Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">🍱 Weekly Meal Plans</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Pre-made plans for every diet and budget — or build your own with our AI chatbot.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🥬", title: "Vegetarian", desc: "Plant-based Indian classics", color: "from-green-50 to-emerald-50 border-green-200" },
              { emoji: "🌱", title: "Vegan", desc: "100% plant-powered meals", color: "from-lime-50 to-green-50 border-lime-200" },
              { emoji: "🍱", title: "Combination", desc: "Best of veg & non-veg", color: "from-blue-50 to-indigo-50 border-blue-200" },
              { emoji: "🍗", title: "Meat Lovers", desc: "Protein-packed favorites", color: "from-red-50 to-orange-50 border-red-200" },
            ].map((plan) => (
              <Link
                key={plan.title}
                href="/meal-plans"
                className={`block p-6 rounded-xl border bg-gradient-to-br ${plan.color} text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
              >
                <span className="text-4xl">{plan.emoji}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{plan.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                <p className="text-xs text-orange-600 font-medium mt-2">Starting at $60/week →</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/meal-plans" className="inline-flex items-center bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Explore Meal Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items / Popular Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">⭐ Popular Picks</h2>
          <p className="mt-3 text-gray-500">Our most loved dishes, handpicked for you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => (
              <div key={item.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                  <span className="text-5xl">{item.is_vegetarian ? "🥬" : "🍗"}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">🔥 {item.calories} cal</span>
                  </div>
                </div>
              </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/menu" className="inline-flex items-center bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            View Full Menu →
          </Link>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              🤖 AI-Powered Ordering
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Don&apos;t know what to order? Our AI chatbot understands your
              cravings and finds the perfect dish.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: "💬", title: "Tell Us Your Mood", desc: "\"I want something spicy under $12\" or \"comfort food for a rainy day\"" },
              { emoji: "🧠", title: "AI Understands", desc: "Our bot extracts your preferences — budget, cuisine, diet, macros — instantly" },
              { emoji: "🍽️", title: "Get Recommendations", desc: "Ranked dishes with nutrition info and one-click add to cart" },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl">{feature.emoji}</span>
                <h3 className="mt-4 font-semibold text-gray-900 text-lg">{feature.title}</h3>
                <p className="mt-2 text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Ingredients Promise */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-12 border-y border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">🌿 Our Clean Food Promise</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Every dish is crafted with ingredients you can trust — because real flavor doesn&apos;t need shortcuts.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "🚫", title: "No Seed Oils", desc: "Cooked in ghee, coconut oil & cold-pressed mustard oil" },
              { emoji: "🌱", title: "Organic Ingredients", desc: "Sourced from certified organic farms" },
              { emoji: "🧂", title: "No Preservatives", desc: "Fresh-made daily with whole spices" },
              { emoji: "💚", title: "Clean Labels", desc: "No artificial colors, flavors, or additives" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-green-100 text-center hover:shadow-md transition-shadow">
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="mt-3 font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="mt-1 text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Macro-Aware Banner */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">💪 Macro-Aware & Clean</h2>
          <p className="mt-4 text-green-100 max-w-2xl mx-auto text-lg">
            Every dish shows calories, protein, carbs, and fat — all made with clean, seed-oil-free, organic ingredients. Filter by macros to match your fitness goals.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            {[
              { label: "Calories", icon: "🔥" },
              { label: "Protein", icon: "💪" },
              { label: "Carbs", icon: "🌾" },
              { label: "Fat", icon: "🧈" },
            ].map((macro) => (
              <div key={macro.label} className="text-center">
                <span className="text-3xl">{macro.icon}</span>
                <p className="text-sm mt-1 font-medium">{macro.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
