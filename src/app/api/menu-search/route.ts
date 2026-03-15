import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const SEARCH_PROMPT = `You are a menu search filter extractor for an Indian restaurant called Desi Quick Bite.
Given a natural language search query, extract structured filters.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "budget_max": null,
  "budget_min": null,
  "cuisine": null,
  "dietary": [],
  "mood": [],
  "max_calories": null,
  "min_protein": null,
  "max_carbs": null,
  "max_fat": null,
  "query_text": "",
  "is_vegetarian": false,
  "is_vegan": false,
  "is_gluten_free": false,
  "spice_level": null,
  "max_price": null,
  "message": "Short friendly description of what you're searching for"
}

RULES:
- If user says "under $X" or "below $X", set budget_max and max_price to X
- If user says "vegetarian", set is_vegetarian: true and dietary: ["vegetarian"]
- If user says "vegan", set is_vegan: true and dietary: ["vegan"]
- If user says "gluten free", set is_gluten_free: true and dietary: ["gluten_free"]
- If user says "spicy", set mood: ["spicy"] and spice_level: "hot"
- If user says "mild", set spice_level: "mild"
- If user mentions specific food like "chicken" or "biryani", set query_text to that
- If user says "high protein", set min_protein: 20
- If user says "low calorie" or "light", set max_calories: 350
- If user mentions a cuisine ("north indian", "south indian", "indo-chinese", "street food"), set cuisine
- Set "message" to a short user-friendly description of the filters applied

IMPORTANT: Always respond with ONLY valid JSON.`;

let _searchModel: ChatOpenAI | null = null;

function getSearchModel(): ChatOpenAI {
  if (_searchModel) return _searchModel;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  _searchModel = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4o-mini",
    temperature: 0.1,
    maxTokens: 300,
  });
  return _searchModel;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const model = getSearchModel();
    const messages = [
      new SystemMessage(SEARCH_PROMPT),
      new HumanMessage(query),
    ];

    const response = await model.invoke(messages);
    const parser = new StringOutputParser();
    const result = await parser.invoke(response);

    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        filters: parsed,
        message: parsed.message || "Showing filtered results",
      });
    } catch {
      return NextResponse.json({
        filters: null,
        message: "Could not parse search filters. Try a simpler query.",
      });
    }
  } catch (error) {
    console.error("Menu search error:", error);
    return NextResponse.json(
      { filters: null, message: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
