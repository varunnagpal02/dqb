import { NextResponse } from "next/server";
import { getChatCompletion } from "@/lib/openai";
import { menuItems, categories } from "@/data/seed-menu";

// Build a category_slug -> cuisine_slug lookup
const catToCuisine: Record<string, string> = {};
categories.forEach((cat) => {
  catToCuisine[cat.slug] = cat.cuisine_slug;
});

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build chat history for OpenAI
    const chatHistory = (history || []).slice(-10).map((h: { role: string; content: string }) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    }));

    // Get AI response
    const aiResponse = await getChatCompletion(message, chatHistory);

    if (!aiResponse) {
      return NextResponse.json(
        {
          reply: "I'm sorry, I couldn't process that. Could you try rephrasing?",
          recommendations: [],
        },
        { status: 200 }
      );
    }

    // AI response is already parsed JSON from getChatCompletion
    const parsedResponse = aiResponse;

    const { message: reply, filters } = parsedResponse;

    // Filter menu items based on extracted preferences
    let recommendations = [...menuItems];

    if (filters) {
      if (filters.cuisine) {
        recommendations = recommendations.filter((item) => {
          const cuisineSlug = catToCuisine[item.category_slug] || "";
          return cuisineSlug.toLowerCase().includes(filters.cuisine.toLowerCase());
        });
      }

      if (filters.is_vegetarian) {
        recommendations = recommendations.filter((item) => item.is_vegetarian);
      }

      if (filters.is_vegan) {
        recommendations = recommendations.filter((item) => item.is_vegan);
      }

      if (filters.is_gluten_free) {
        recommendations = recommendations.filter((item) => item.is_gluten_free);
      }

      if (filters.max_price) {
        recommendations = recommendations.filter(
          (item) => item.price <= filters.max_price
        );
      }

      if (filters.max_calories) {
        recommendations = recommendations.filter(
          (item) => item.calories <= filters.max_calories
        );
      }

      if (filters.min_protein) {
        recommendations = recommendations.filter(
          (item) => item.protein_g >= filters.min_protein
        );
      }

      if (filters.spice_level) {
        if (filters.spice_level === "mild") {
          recommendations = recommendations.filter(
            (item) => item.spice_level <= 1
          );
        } else if (filters.spice_level === "medium") {
          recommendations = recommendations.filter(
            (item) => item.spice_level >= 2 && item.spice_level <= 3
          );
        } else if (filters.spice_level === "hot") {
          recommendations = recommendations.filter(
            (item) => item.spice_level >= 4
          );
        }
      }

      if (filters.mood && Array.isArray(filters.mood)) {
        recommendations = recommendations.filter((item) =>
          item.mood_tags.some((tag) =>
            filters.mood.some(
              (m: string) => m.toLowerCase() === tag.toLowerCase()
            )
          )
        );
      }
    }

    // Limit to top 5 recommendations
    const topRecommendations = recommendations.slice(0, 5).map((item) => ({
      id: item.name.toLowerCase().replace(/\s+/g, "-"),
      name: item.name,
      description: item.description,
      price: item.price,
      calories: item.calories,
      protein_g: item.protein_g,
      carbs_g: item.carbs_g,
      fat_g: item.fat_g,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      spice_level: item.spice_level,
      cuisine: catToCuisine[item.category_slug] || "",
    }));

    return NextResponse.json({
      reply: reply || "Here are some dishes I think you'd enjoy! 🍛",
      recommendations: topRecommendations,
      filters: filters || null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "I'm having trouble connecting right now. Please try again in a moment! 🙏",
        recommendations: [],
      },
      { status: 200 }
    );
  }
}
