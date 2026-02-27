"use client";

import Link from "next/link";

export default function AdminPage() {
  const adminCards = [
    {
      title: "Menu Management",
      description: "Add, edit, or remove menu items. Update prices, availability, and nutritional info.",
      icon: "🍽️",
      href: "/admin/menu",
      stats: "Manage Items",
    },
    {
      title: "Order Management",
      description: "View all orders, update statuses, and track deliveries in real-time.",
      icon: "📦",
      href: "/admin/orders",
      stats: "View Orders",
    },
    {
      title: "AI Chatbot",
      description: "The chatbot uses seed data + OpenAI. No admin config needed — it auto-updates with menu changes.",
      icon: "🤖",
      href: "#",
      stats: "Auto-managed",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">
          Manage your Desi Quick Bite restaurant operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Menu Items", value: "45+", icon: "🍛", color: "bg-orange-50 border-orange-200" },
          { label: "Cuisines", value: "6", icon: "🌍", color: "bg-blue-50 border-blue-200" },
          { label: "AI Chatbot", value: "Active", icon: "🤖", color: "bg-green-50 border-green-200" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} border rounded-xl p-6 text-center`}
          >
            <span className="text-3xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <span className="text-4xl">{card.icon}</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
            <div className="mt-4 text-orange-600 font-medium text-sm">
              {card.stats} →
            </div>
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900">
          🔐 Admin Access
        </h3>
        <p className="text-sm text-amber-700 mt-2">
          Admin features are protected by email-based authorization. Only the
          email configured in ADMIN_EMAIL environment variable has access.
          Make sure to set up your Supabase authentication and environment
          variables before using admin features.
        </p>
      </div>
    </div>
  );
}
