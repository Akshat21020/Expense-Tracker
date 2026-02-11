import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const categorizeExpense = async (req, res) => {
  const { text } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `Categorize this expense into Food, Transport, Rent, Shopping, Subscription, Other:
      "${text}"
      Return only category name.`
    }]
  });

  res.json({ category: response.choices[0].message.content });
};
