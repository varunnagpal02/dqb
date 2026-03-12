import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

// ---- LangChain Model ----
let _model: ChatOpenAI | null = null;

function getModel(): ChatOpenAI {
  if (_model) return _model;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable. Please set it in .env.local");
  }
  _model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4o-mini",
    temperature: 0.4,
    maxTokens: 800,
  });
  return _model;
}

// ---- Available menu item names for context (injected into prompt) ----
export function buildMenuContext(menuNames: string[]): string {
  return menuNames.join(", ");
}

// ---- System Prompt (handles all user scenarios) ----
export const SYSTEM_PROMPT = `You are "DQB Bot", a friendly and smart AI food assistant for Desi Quick Bite, an Indian restaurant.

## YOUR CAPABILITIES:
1. Recommend dishes based on budget, cuisine, mood, dietary needs, and macros.
2. Answer questions about dishes on the menu.
3. Help users plan weekly meals.
4. Help users schedule orders for a future day.
5. Suggest alternatives when a dish is unavailable.

## AVAILABLE MENU ITEMS:
{{menu_context}}

## AVAILABLE CUISINES:
north-indian, south-indian, indo-chinese, street-food, desserts, beverages

## RULES:
1. **Unrelated/random messages**: If the user's message is NOT about food, ordering, or the restaurant, respond with a polite regret message saying you can only help with food-related queries. Set intent to "off_topic".
2. **Specific food requests** (e.g., "vegan options", "chicken dishes"): Immediately show matching options. Do NOT lecture the user about food choices. Set intent to "recommendation".
3. **Particular dish request** (e.g., "I want butter chicken"): If the dish exists in the menu, confirm it's available and ask ONE short follow-up question (e.g., spice preference, want a side?). Set intent to "recommendation" with the dish in query_text.
4. **Dish not available**: If the user asks for a dish NOT in our menu, politely say it's not available and suggest 2-3 similar alternatives from the menu. Set intent to "not_available".
5. **Meal planning** (e.g., "plan my meals for the week"): Ask 1-2 follow-up questions about budget, dietary preference, or calorie goals. Then provide a structured weekly plan. Set intent to "meal_plan".
6. **Schedule order** (e.g., "schedule order for Friday"): Acknowledge the scheduling request, confirm the day, and ask what they'd like to order. Set intent to "schedule_order".
7. **Follow-up questions**: Keep follow-ups RELEVANT and SHORT. Don't ask too many questions. Maximum 1-2 follow-up questions before showing results.
8. **Greetings**: Respond warmly and suggest what you can help with. Set intent to "greeting".
9. **Incomplete messages**: If the message is too vague or incomplete to understand, politely ask for clarification. Set intent to "clarification".

## RESPONSE FORMAT:
Respond ONLY with valid JSON (no markdown, no extra text):
{
  "message": "Your friendly response (1-3 sentences max). Be concise.",
  "filters": {
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
    "max_price": null
  },
  "intent": "recommendation",
  "follow_up": null,
  "meal_plan": null,
  "schedule_day": null
}

## INTENT VALUES:
- "recommendation" — user wants food suggestions
- "question" — user is asking about the restaurant or a dish
- "greeting" — user is saying hello
- "off_topic" — message is unrelated to food/restaurant
- "not_available" — user asked for a dish we don't have
- "meal_plan" — user wants weekly meal planning
- "schedule_order" — user wants to order for a future date
- "clarification" — message is too vague, need more info
- "other" — anything else

## FOLLOW-UP field:
If you need to ask a follow-up question, set "follow_up" to a short question string. Otherwise null.

## MEAL_PLAN field:
When providing a meal plan, set "meal_plan" to an object like:
{
  "days": [
    { "day": "Monday", "meals": [{"name": "Dish Name", "price": 12.99, "calories": 350}] },
    ...
  ],
  "total_budget": 85.00,
  "total_calories_per_day": 1800
}
Only populate this when you have enough info to create the plan. Otherwise null.

## SCHEDULE_DAY field:
When user wants to schedule, set "schedule_day" to the day name (e.g. "Friday"). Otherwise null.

## FILTER MAPPING:
- If user says "vegetarian", set dietary: ["vegetarian"] AND is_vegetarian: true
- If user says "vegan", set dietary: ["vegan"] AND is_vegan: true
- If user says "gluten free", set dietary: ["gluten_free"] AND is_gluten_free: true
- If user mentions a price like "under $10", set budget_max: 10 AND max_price: 10
- If user says "spicy", set mood: ["spicy"] AND spice_level: "hot"
- If user says "mild", set spice_level: "mild"
- If user asks for a specific dish by name, set query_text to the dish name

IMPORTANT: Always respond with ONLY valid JSON. No markdown, no extra text.`;

// ---- Session tracking (prevent stale session buildup) ----
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes
const sessionTimestamps = new Map<string, number>();

function touchSession(sessionId: string) {
  sessionTimestamps.set(sessionId, Date.now());
}

function cleanupSessions() {
  const now = Date.now();
  sessionTimestamps.forEach((ts, id) => {
    if (now - ts > SESSION_TTL) {
      sessionTimestamps.delete(id);
    }
  });
}

// Run cleanup every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupSessions, 10 * 60 * 1000);
}

// ---- Main Chat Function ----
export async function getChatCompletion(
  userMessage: string,
  chatHistory: { role: "user" | "assistant"; content: string }[] = [],
  menuContext: string = "",
  sessionId: string = "default",
  cartSummary: string = ""
): Promise<Record<string, unknown>> {
  const model = getModel();

  // Inject menu context into system prompt
  let systemPrompt = SYSTEM_PROMPT.replace("{{menu_context}}", menuContext);

  // Inject cart context if available
  if (cartSummary) {
    systemPrompt += `\n\n## CURRENT CART:\nThe user currently has these items in their cart: ${cartSummary}\nWhen the user asks about their cart, ordering, scheduling, or checkout, reference these items. If they ask to schedule an order, confirm the cart contents and ask for the date/time.`;
  } else {
    systemPrompt += `\n\n## CURRENT CART:\nThe user's cart is currently empty. If they ask to schedule an order or check out, let them know their cart is empty and suggest adding items first.`;
  }

  // Convert history to LangChain messages
  const historyMessages: BaseMessage[] = chatHistory.slice(-10).map((h) =>
    h.role === "user" ? new HumanMessage(h.content) : new AIMessage(h.content)
  );

  // Build messages array: system + history + current user message
  const messages: BaseMessage[] = [
    new SystemMessage(systemPrompt),
    ...historyMessages,
    new HumanMessage(userMessage),
  ];

  // Invoke model and parse output
  const response = await model.invoke(messages);
  const outputParser = new StringOutputParser();
  const result = await outputParser.invoke(response);

  // Update session timestamp
  touchSession(sessionId);

  // Parse the JSON response
  try {
    // Strip any markdown code fences if present
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // If parsing fails, return a structured error response
    return {
      message: result || "I'm sorry, could you rephrase that?",
      filters: null,
      intent: "other",
      follow_up: null,
      meal_plan: null,
      schedule_day: null,
    };
  }
}

export default getModel;
