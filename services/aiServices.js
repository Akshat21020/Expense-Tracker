import openai from "../config/ai.js";

// 🔹 In-memory cache
const cache = new Map();

// 🔹 Cache TTL (e.g., 24 hours)
const CACHE_TTL = 24 * 60 * 60 * 1000;

// 🔹 Normalize input
const normalize = (text = "") =>
  text.toLowerCase().trim();

// 🔹 Fallback logic
const fallbackCategorize = (text) => {
  if (text.includes("swiggy") || text.includes("zomato"))
    return "Food";
  if (text.includes("uber") || text.includes("ola"))
    return "Travel";
  if (text.includes("amazon") || text.includes("flipkart"))
    return "Shopping";
  if (text.includes("rent") || text.includes("electricity"))
    return "Bills";

  return "Other";
};

// 🔥 MAIN FUNCTION
export const categorizeExpenseAI = async (description = "") => {
  try {
    if (!description) return "Other";

    const normalized = normalize(description);

    // 🧠 1. Check cache
    if (cache.has(normalized)) {
      const { value, timestamp } = cache.get(normalized);

      // check expiry
      if (Date.now() - timestamp < CACHE_TTL) {
        return value;
      } else {
        cache.delete(normalized);
      }
    }

    // 🤖 2. Call OpenAI
    const prompt = `
Categorize this expense into one category:
Food, Travel, Shopping, Bills, Entertainment, Other.

Expense: "${description}"

Only return the category name.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0,
    });

    let category =
      response.choices[0].message.content.trim();

    // 🧹 sanitize response
    category = category.replace(/[^a-zA-Z]/g, "");

    // 🧠 3. Store in cache
    cache.set(normalized, {
      value: category,
      timestamp: Date.now(),
    });

    return category;
  } catch (error) {
    console.error("AI Error → fallback:", error.message);

    return fallbackCategorize(normalize(description));
  }
};