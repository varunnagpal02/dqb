"use client";

import React from "react";

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  { emoji: "🌶️", label: "Spicy", query: "Show me something spicy" },
  { emoji: "💪", label: "High Protein", query: "High protein low carb meal" },
  { emoji: "💰", label: "Under $10", query: "Best dishes under $10" },
  { emoji: "🥗", label: "Healthy", query: "Healthy low calorie options" },
  { emoji: "🌱", label: "Vegan", query: "Show me vegan dishes" },
  { emoji: "🎉", label: "Party", query: "Dishes for a celebration" },
  { emoji: "📅", label: "Meal Plan", query: "Help me plan meals for the week" },
  { emoji: "⏰", label: "Schedule", query: "I want to schedule an order" },
];

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {prompts.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p.query)}
          className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors"
        >
          <span>{p.emoji}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );
}
