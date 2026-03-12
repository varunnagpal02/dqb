import { NextResponse } from "next/server";
import { getChatCompletion, buildMenuContext } from "@/lib/openai";
import { menuItems, categories } from "@/data/seed-menu";

// Build a category_slug -> cuisine_slug lookup
const catToCuisine: Record<string, string> = {};
categories.forEach((cat) => {
  catToCuisine[cat.slug] = cat.cuisine_slug;
});

// Pre-build menu context string for the AI prompt
const menuNamesList = menuItems.map((item) => item.name);
const menuContext = buildMenuContext(menuNamesList);

// Fuzzy match: check if a dish name partially matches any menu item
function findMatchingItems(query: string) {
  const q = query.toLowerCase().trim();
  return menuItems.filter((item) => {
    const name = item.name.toLowerCase();
    const keywords = item.keywords.map((k) => k.toLowerCase());
    return (
      name.includes(q) ||
      q.includes(name) ||
      keywords.some((kw) => q.includes(kw) || kw.includes(q)) ||
      // Word-by-word matching
      q.split(/\s+/).some(
        (word) =>
          word.length > 2 &&
          (name.includes(word) || keywords.some((kw) => kw.includes(word)))
      )
    );
  });
}

// Find similar items when requested dish is not available
function findSimilarItems(query: string, maxResults: number = 3) {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = menuItems.map((item) => {
    let score = 0;
    const name = item.name.toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const keywords = item.keywords.map((k) => k.toLowerCase());

    for (const word of words) {
      if (name.includes(word)) score += 3;
      if (keywords.some((kw) => kw.includes(word))) score += 2;
      if (desc.includes(word)) score += 1;
    }

    // Boost items from the same cuisine category
    const itemCuisine = catToCuisine[item.category_slug] || "";
    if (words.some((w) => itemCuisine.includes(w))) score += 2;

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.item);
}

export async function POST(request: Request) {
  try {
    const { message, history, sessionId, cartSummary } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build chat history for LangChain
    const chatHistory = (history || []).slice(-10).map((h: { role: string; content: string }) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    }));

    // Get AI response via LangChain
    const aiResponse = await getChatCompletion(
      message,
      chatHistory,
      menuContext,
      sessionId || "default",
      typeof cartSummary === "string" ? cartSummary : ""
    );

    if (!aiResponse) {
      return NextResponse.json(
        {
          reply: "I'm sorry, I couldn't process that. Could you try rephrasing?",
          recommendations: [],
          intent: "other",
        },
        { status: 200 }
      );
    }

    const {
      message: reply,
      filters,
      intent,
      follow_up,
      meal_plan,
      schedule_day,
    } = aiResponse as {
      message: string;
      filters: Record<string, unknown> | null;
      intent: string;
      follow_up: string | null;
      meal_plan: Record<string, unknown> | null;
      schedule_day: string | null;
    };

    // --- Handle off-topic/unrelated messages ---
    if (intent === "off_topic") {
      return NextResponse.json({
        reply: reply || "I'm sorry, I can only help with food orders and recommendations at Desi Quick Bite. How can I help you find your perfect meal? 🍛",
        recommendations: [],
        intent: "off_topic",
        follow_up: null,
        meal_plan: null,
        schedule_day: null,
      });
    }

    // --- Handle clarification needed ---
    if (intent === "clarification") {
      return NextResponse.json({
        reply: reply || "I'm not sure I understood that. Could you tell me more about what you're looking for? For example, a cuisine type, budget, or dietary preference?",
        recommendations: [],
        intent: "clarification",
        follow_up: follow_up || null,
        meal_plan: null,
        schedule_day: null,
      });
    }

    // --- Handle greetings ---
    if (intent === "greeting") {
      return NextResponse.json({
        reply: reply || "Hey there! 👋 Welcome to Desi Quick Bite! I can help you find dishes by mood, budget, diet, or macros. What are you in the mood for?",
        recommendations: [],
        intent: "greeting",
        follow_up: null,
        meal_plan: null,
        schedule_day: null,
      });
    }

    // --- Handle meal plan ---
    if (intent === "meal_plan") {
      // If AI is still asking follow-up questions, return without recommendations
      if (follow_up && !meal_plan) {
        return NextResponse.json({
          reply: reply,
          recommendations: [],
          intent: "meal_plan",
          follow_up: follow_up,
          meal_plan: null,
          schedule_day: null,
        });
      }

      // If we have a meal plan, validate dish names against our menu
      if (meal_plan) {
        return NextResponse.json({
          reply: reply,
          recommendations: [],
          intent: "meal_plan",
          follow_up: null,
          meal_plan: meal_plan,
          schedule_day: null,
        });
      }

      return NextResponse.json({
        reply: reply || "I'd love to help you plan your meals for the week! What's your daily budget and any dietary preferences?",
        recommendations: [],
        intent: "meal_plan",
        follow_up: follow_up || "What's your daily budget and any dietary preferences?",
        meal_plan: null,
        schedule_day: null,
      });
    }

    // --- Handle schedule order ---
    if (intent === "schedule_order") {
      return NextResponse.json({
        reply: reply || `Got it! I'll help you set up an order${schedule_day ? ` for ${schedule_day}` : ""}. What would you like to order?`,
        recommendations: [],
        intent: "schedule_order",
        follow_up: follow_up || "What dishes would you like to include?",
        meal_plan: null,
        schedule_day: schedule_day || null,
      });
    }

    // --- Handle dish not available ---
    if (intent === "not_available") {
      const queryText = (filters as Record<string, string>)?.query_text || message;
      const similar = findSimilarItems(queryText);
      const similarFormatted = similar.map((item) => ({
        id: item.name.toLowerCase().replace(/\s+/g, "-"),
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: null,
        calories: item.calories,
        protein_g: item.protein_g,
        carbs_g: item.carbs_g,
        fat_g: item.fat_g,
        fiber_g: item.fiber_g,
        is_vegetarian: item.is_vegetarian,
        is_vegan: item.is_vegan,
        is_gluten_free: item.is_gluten_free,
        is_spicy: item.is_spicy,
        spice_level: item.spice_level,
        mood_tags: item.mood_tags,
        keywords: item.keywords,
        category_id: "",
        is_available: true,
        is_active: true,
        sort_order: item.sort_order,
        created_at: "",
        updated_at: "",
        cuisine: catToCuisine[item.category_slug] || "",
      }));

      return NextResponse.json({
        reply: reply || "I'm sorry, we don't have that dish on our menu. But here are some similar options you might enjoy!",
        recommendations: similarFormatted,
        intent: "not_available",
        follow_up: null,
        meal_plan: null,
        schedule_day: null,
      });
    }

    // --- Handle recommendations (default path) ---
    let recommendations = [...menuItems];

    if (filters) {
      const f = filters as Record<string, unknown>;

      // Text/name search
      if (f.query_text && typeof f.query_text === "string" && f.query_text.trim()) {
        const matched = findMatchingItems(f.query_text);
        if (matched.length > 0) {
          recommendations = matched;
        }
      }

      // Cuisine filter
      if (f.cuisine && typeof f.cuisine === "string") {
        const cuisineFiltered = recommendations.filter((item) => {
          const cuisineSlug = catToCuisine[item.category_slug] || "";
          return cuisineSlug.toLowerCase().includes((f.cuisine as string).toLowerCase());
        });
        if (cuisineFiltered.length > 0) recommendations = cuisineFiltered;
      }

      // Dietary filters
      if (f.is_vegetarian === true || (Array.isArray(f.dietary) && f.dietary.includes("vegetarian"))) {
        recommendations = recommendations.filter((item) => item.is_vegetarian);
      }

      if (f.is_vegan === true || (Array.isArray(f.dietary) && f.dietary.includes("vegan"))) {
        recommendations = recommendations.filter((item) => item.is_vegan);
      }

      if (f.is_gluten_free === true || (Array.isArray(f.dietary) && f.dietary.includes("gluten_free"))) {
        recommendations = recommendations.filter((item) => item.is_gluten_free);
      }

      // Price filters
      const maxPrice = f.max_price ?? f.budget_max;
      if (typeof maxPrice === "number" && maxPrice > 0) {
        recommendations = recommendations.filter((item) => item.price <= maxPrice);
      }

      const minPrice = f.budget_min;
      if (typeof minPrice === "number" && minPrice > 0) {
        recommendations = recommendations.filter((item) => item.price >= minPrice);
      }

      // Macro filters
      if (typeof f.max_calories === "number") {
        recommendations = recommendations.filter((item) => item.calories <= (f.max_calories as number));
      }

      if (typeof f.min_protein === "number") {
        recommendations = recommendations.filter((item) => item.protein_g >= (f.min_protein as number));
      }

      if (typeof f.max_carbs === "number") {
        recommendations = recommendations.filter((item) => item.carbs_g <= (f.max_carbs as number));
      }

      if (typeof f.max_fat === "number") {
        recommendations = recommendations.filter((item) => item.fat_g <= (f.max_fat as number));
      }

      // Spice level filter
      if (f.spice_level) {
        if (f.spice_level === "mild") {
          recommendations = recommendations.filter((item) => item.spice_level <= 1);
        } else if (f.spice_level === "medium") {
          recommendations = recommendations.filter((item) => item.spice_level >= 2 && item.spice_level <= 3);
        } else if (f.spice_level === "hot") {
          recommendations = recommendations.filter((item) => item.spice_level >= 4);
        }
      }

      // Mood filter
      if (Array.isArray(f.mood) && f.mood.length > 0) {
        const moodFiltered = recommendations.filter((item) =>
          item.mood_tags.some((tag) =>
            (f.mood as string[]).some((m) => m.toLowerCase() === tag.toLowerCase())
          )
        );
        if (moodFiltered.length > 0) recommendations = moodFiltered;
      }
    }

    // Keyword fallback: if filters didn't narrow results, search the original message against item keywords
    if (recommendations.length === menuItems.length) {
      const keywordMatched = findMatchingItems(message);
      if (keywordMatched.length > 0) {
        recommendations = keywordMatched;
      }
    }

    // If no results after filtering, try fuzzy search on the original message
    if (recommendations.length === 0) {
      const fallback = findSimilarItems(message, 5);
      if (fallback.length > 0) {
        recommendations = fallback;
      }
    }

    // Shuffle filtered results so repeated queries get varied suggestions
    for (let i = recommendations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [recommendations[i], recommendations[j]] = [recommendations[j], recommendations[i]];
    }

    // Limit to top 5 recommendations, include all fields needed for cart
    const topRecommendations = recommendations.slice(0, 5).map((item) => ({
      id: item.name.toLowerCase().replace(/\s+/g, "-"),
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: null,
      calories: item.calories,
      protein_g: item.protein_g,
      carbs_g: item.carbs_g,
      fat_g: item.fat_g,
      fiber_g: item.fiber_g,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      is_spicy: item.is_spicy,
      spice_level: item.spice_level,
      mood_tags: item.mood_tags,
      keywords: item.keywords,
      category_id: "",
      is_available: true,
      is_active: true,
      sort_order: item.sort_order,
      created_at: "",
      updated_at: "",
      cuisine: catToCuisine[item.category_slug] || "",
    }));

    // Build response message
    let responseMessage = reply || "Here are some dishes I think you'd enjoy! 🍛";
    if (topRecommendations.length === 0 && intent === "recommendation") {
      responseMessage = "I couldn't find dishes matching all your criteria. Try adjusting your filters — maybe a higher budget or fewer restrictions?";
    }

    return NextResponse.json({
      reply: responseMessage,
      recommendations: topRecommendations,
      intent: intent || "recommendation",
      follow_up: follow_up || null,
      meal_plan: meal_plan || null,
      schedule_day: schedule_day || null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "I'm having trouble connecting right now. Please try again in a moment! 🙏",
        recommendations: [],
        intent: "error",
      },
      { status: 200 }
    );
  }
}
