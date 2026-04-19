import Expense from "../models/Expense.js";
import openai from "../config/ai.js";

// Helper: group by category
const groupByCategory = (expenses) => {
  const map = {};

  expenses.forEach((exp) => {
    map[exp.category] = (map[exp.category] || 0) + exp.amount;
  });

  return map;
};

// Helper: total
const getTotal = (expenses) =>
  expenses.reduce((sum, exp) => sum + exp.amount, 0);

export const generateInsights = async (userId) => {
  const now = new Date();

  const startOfThisMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const thisMonthExpenses = await Expense.find({
    user: userId,
    date: { $gte: startOfThisMonth },
  });

  const lastMonthExpenses = await Expense.find({
    user: userId,
    date: {
      $gte: startOfLastMonth,
      $lt: startOfThisMonth,
    },
  });

  const thisTotal = getTotal(thisMonthExpenses);
  const lastTotal = getTotal(lastMonthExpenses);

  // % change
  let percentageChange = 0;
  if (lastTotal > 0) {
    percentageChange =
      ((thisTotal - lastTotal) / lastTotal) * 100;
  }

  // category breakdown
  const categoryMap = groupByCategory(thisMonthExpenses);

  // highest category
  let topCategory = "None";
  let max = 0;

  for (const cat in categoryMap) {
    if (categoryMap[cat] > max) {
      max = categoryMap[cat];
      topCategory = cat;
    }
  }

  return {
    thisMonthTotal: thisTotal,
    lastMonthTotal: lastTotal,
    percentageChange: percentageChange.toFixed(2),
    topCategory,
    categoryBreakdown: categoryMap,
  };
};

export const generateAIInsights = async (data) => {
  try {
    const prompt = `
You are a financial assistant.

Analyze this data and give 3 short insights:

Data:
- This month total: ${data.thisMonthTotal}
- Last month total: ${data.lastMonthTotal}
- Change: ${data.percentageChange}%
- Top category: ${data.topCategory}

Keep it concise and user-friendly.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Insight Error:", error.message);

    return `You spent ${data.percentageChange}% ${
      data.percentageChange > 0 ? "more" : "less"
    } than last month. Your top category is ${data.topCategory}.`;
  }
};