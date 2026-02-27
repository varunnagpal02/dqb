import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get("cuisine");
    const category = searchParams.get("category");
    const vegetarian = searchParams.get("vegetarian");
    const vegan = searchParams.get("vegan");
    const glutenFree = searchParams.get("gluten_free");
    const maxPrice = searchParams.get("max_price");
    const maxCalories = searchParams.get("max_calories");
    const search = searchParams.get("search");

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("menu_items")
      .select(
        `
        *,
        cuisine:cuisines(id, name, slug),
        category:categories(id, name, slug)
      `
      )
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    // Apply filters
    if (cuisine) {
      query = query.eq("cuisines.slug", cuisine);
    }
    if (category) {
      query = query.eq("categories.slug", category);
    }
    if (vegetarian === "true") {
      query = query.eq("is_vegetarian", true);
    }
    if (vegan === "true") {
      query = query.eq("is_vegan", true);
    }
    if (glutenFree === "true") {
      query = query.eq("is_gluten_free", true);
    }
    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }
    if (maxCalories) {
      query = query.lte("calories", parseInt(maxCalories));
    }
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Menu fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch menu items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data });
  } catch (error) {
    console.error("Menu API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
