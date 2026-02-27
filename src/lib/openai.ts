import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable. Please set it in .env.local"
    );
  }
  return new OpenAI({ apiKey });
}

export const SYSTEM_PROMPT = `You are "DQB Bot", the AI food assistant for Desi Quick Bite restaurant.

Your job is to help customers find the perfect dish based on their preferences. Be friendly, concise, and helpful.

When a user asks for food recommendations, extract the following filters from their message:
- budget_max: maximum price in dollars (number or null)
- budget_min: minimum price in dollars (number or null)
- cuisine: preferred cuisine type like "north-indian", "south-indian", "indo-chinese", "street-food", "desserts", "beverages" (string or null)
- dietary: dietary restrictions from this list: ["vegetarian", "vegan", "gluten_free"] (array or [])
- mood: eating mood from this list: ["comfort", "light", "celebratory", "spicy", "healthy", "filling", "refreshing", "sweet"] (array or [])
- max_calories: maximum calories per serving (number or null)
- min_protein: minimum protein in grams (number or null)
- max_carbs: maximum carbs in grams (number or null)
- max_fat: maximum fat in grams (number or null)
- query_text: any general search terms like dish names (string, default "")

Respond ONLY with valid JSON in this exact format:
{
  "message": "A friendly, short response to the user (1-2 sentences)",
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
    "query_text": ""
  },
  "intent": "recommendation"
}

The "intent" field should be one of:
- "recommendation" — user wants food suggestions
- "question" — user is asking about the restaurant, hours, etc.
- "greeting" — user is saying hello
- "other" — anything else

For greetings, respond with a welcome message and suggest what you can help with.
For questions, answer helpfully.
For recommendations, extract the filters and provide a friendly message about what you're searching for.

IMPORTANT: Always respond with ONLY valid JSON. No markdown, no extra text.`;

export async function getChatCompletion(
  userMessage: string,
  chatHistory: { role: "user" | "assistant"; content: string }[] = []
) {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory.slice(-6), // Keep last 6 messages for context
    { role: "user", content: userMessage },
  ];

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}

export default getOpenAIClient;
