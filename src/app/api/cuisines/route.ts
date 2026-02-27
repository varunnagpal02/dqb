import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("cuisines")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Cuisines fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch cuisines" },
        { status: 500 }
      );
    }

    return NextResponse.json({ cuisines: data });
  } catch (error) {
    console.error("Cuisines API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
