"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { ChatMessage as ChatMessageType, MealPlan } from "@/types";
import { generateId } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { menuItems as seedMenuItems } from "@/data/seed-menu";
import ChatMessage from "./ChatMessage";
import RecommendationCard from "./RecommendationCard";
import QuickPrompts from "./QuickPrompts";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items: cartItems, subtotal } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for external open-chat-widget events (e.g. from home page "Ask AI Bot" button)
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat-widget", handleOpenChat);
    return () => window.removeEventListener("open-chat-widget", handleOpenChat);
  }, []);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          content:
            "Hi there! 👋 I'm DQB Bot, your food assistant. I can help you:\n\n🍽️ Find dishes by mood, budget, or diet\n💪 Get macro-friendly recommendations\n📅 Plan meals for the week\n⏰ Schedule orders for later\n\nWhat are you in the mood for?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build cart summary for context
      const cartSummary = cartItems.length > 0
        ? cartItems.map((ci) => `${ci.menu_item.name} x${ci.quantity} ($${(ci.menu_item.price * ci.quantity).toFixed(2)})`).join(", ") + ` | Total: $${subtotal.toFixed(2)}`
        : "";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionId,
          cartSummary,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessageType = {
        id: generateId(),
        role: "assistant",
        content: data.reply || data.message || "I couldn't process that. Please try again!",
        recommendations: data.recommendations || [],
        intent: data.intent || "other",
        follow_up: data.follow_up || null,
        meal_plan: data.meal_plan || null,
        schedule_day: data.schedule_day || null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white rounded-full p-4 shadow-lg hover:bg-orange-700 transition-all duration-200 hover:scale-105 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow animate-bounce">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="text-white font-semibold text-sm">DQB Bot</h3>
                <p className="text-orange-100 text-xs">AI Food Assistant • LangChain powered</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-orange-100 hover:text-white p-1 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[400px]">
            {messages.map((msg) => (
              <div key={msg.id}>
                <ChatMessage message={msg} />
                {/* Recommendation cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.recommendations.map((item) => (
                      <RecommendationCard key={item.id || item.name} item={item} />
                    ))}
                  </div>
                )}
                {/* Meal plan display */}
                {msg.meal_plan && msg.meal_plan.days && (
                  <MealPlanCard mealPlan={msg.meal_plan} />
                )}
                {/* Schedule order badge */}
                {msg.schedule_day && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <span>📅</span>
                    <span>Scheduled for {msg.schedule_day}</span>
                  </div>
                )}
                {/* Follow-up suggestion chip */}
                {msg.follow_up && msg.role === "assistant" && (
                  <button
                    onClick={() => sendMessage(msg.follow_up!)}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors border border-orange-200"
                  >
                    <span>💡</span>
                    <span>{msg.follow_up}</span>
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding dishes for you...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <QuickPrompts onSelect={handleQuickPrompt} />
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-100 px-4 py-3 flex gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you craving?"
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-orange-600 text-white rounded-full p-2 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// ---- Meal Plan Card component with Add to Cart ----
function MealPlanCard({ mealPlan }: { mealPlan: MealPlan }) {
  const { items: cartItems, addItem, removeItem } = useCart();

  // Generate a consistent slug-id matching the API route format
  const toSlugId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  // Lookup a real menu item by name (fuzzy) and convert to MenuItem shape for cart
  const findMenuItemForCart = (mealName: string) => {
    const lower = mealName.toLowerCase().trim();
    const seed = seedMenuItems.find(
      (item) =>
        item.name.toLowerCase() === lower ||
        item.name.toLowerCase().includes(lower) ||
        lower.includes(item.name.toLowerCase())
    );
    if (!seed) return null;
    // Convert SeedMenuItem to MenuItem shape with generated id
    return {
      id: toSlugId(seed.name),
      category_id: "",
      name: seed.name,
      description: seed.description,
      price: seed.price,
      image_url: null,
      is_vegetarian: seed.is_vegetarian,
      is_vegan: seed.is_vegan,
      is_gluten_free: seed.is_gluten_free,
      is_spicy: seed.is_spicy,
      spice_level: seed.spice_level,
      calories: seed.calories,
      protein_g: seed.protein_g,
      carbs_g: seed.carbs_g,
      fat_g: seed.fat_g,
      fiber_g: seed.fiber_g,
      mood_tags: seed.mood_tags,
      keywords: seed.keywords,
      is_available: true,
      is_active: true,
      sort_order: seed.sort_order,
      created_at: "",
      updated_at: "",
    };
  };

  const isInCart = (mealName: string) => {
    const menuItem = findMenuItemForCart(mealName);
    if (!menuItem) return false;
    return cartItems.some((ci) => ci.menu_item.id === menuItem.id);
  };

  const handleToggleMeal = (mealName: string) => {
    const menuItem = findMenuItemForCart(mealName);
    if (!menuItem) return;
    if (cartItems.some((ci) => ci.menu_item.id === menuItem.id)) {
      removeItem(menuItem.id);
    } else {
      addItem(menuItem);
    }
  };

  return (
    <div className="mt-2 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 text-sm">
      <div className="flex items-center gap-1.5 font-semibold text-green-800 mb-2">
        <span>📋</span>
        <span>Your Meal Plan</span>
      </div>
      <div className="space-y-2">
        {mealPlan.days.map((day) => (
          <div key={day.day} className="bg-white/70 rounded-lg p-2">
            <div className="font-medium text-green-700 text-xs mb-1">{day.day}</div>
            <div className="space-y-1">
              {day.meals.map((meal, i) => {
                const menuItem = findMenuItemForCart(meal.name);
                const inCart = isInCart(meal.name);
                return (
                  <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex-1 truncate">{meal.name}</span>
                    <span className="text-green-600 font-medium mx-2 whitespace-nowrap">
                      ${meal.price?.toFixed(2)} • {meal.calories} cal
                    </span>
                    {menuItem && (
                      <button
                        onClick={() => handleToggleMeal(meal.name)}
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          inCart
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                        }`}
                      >
                        {inCart ? "Remove" : "Add"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {(mealPlan.total_budget || mealPlan.total_calories_per_day) && (
        <div className="mt-2 pt-2 border-t border-green-200 flex justify-between text-xs text-green-700 font-medium">
          {mealPlan.total_budget && <span>Total: ${mealPlan.total_budget.toFixed(2)}/week</span>}
          {mealPlan.total_calories_per_day && <span>~{mealPlan.total_calories_per_day} cal/day</span>}
        </div>
      )}
    </div>
  );
}
