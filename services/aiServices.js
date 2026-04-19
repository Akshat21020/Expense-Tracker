import client from "../config/ai.js";

const categoryKeywords = {
  Food: ["swiggy", "zomato", "restaurant", "food"],
  Travel: ["uber", "ola", "taxi", "flight"],
  Shopping: ["amazon", "flipkart"],
  Bills: ["rent", "electricity", "bill"],
};

const fallbackCategorize = (text) => {
  text = text.toLowerCase();

  for (const category in categoryKeywords) {
    for (const keyword of categoryKeywords[category]) {
      if (text.includes(keyword)) return category;
    }
  }
  return "Other";
};

export const categorizeExpenseAI = async (description = "") => {
  try {
    if (!description) return "Other";

    const prompt = `
Categorize this expense into one of these categories:
Food, Travel, Shopping, Bills, Entertainment, Other.

Expense: "${description}"

Only return the category name.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0,
    });

    const category = response.choices[0].message.content.trim();

    return category;
  } catch (error) {
    console.error("AI Error → using fallback:", error.message);
    return fallbackCategorize(description);
  }
};