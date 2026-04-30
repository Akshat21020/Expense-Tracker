import {
  generateInsights,
  generateAIInsights,
  getBudgetStatus,
} from "../services/insightService.js";

import { getCache, setCache } from "../utils/cache.js";

export const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

    const cacheKey = `insights:${userId}:${monthKey}`;

    const cached = getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rawData = await generateInsights(userId);
    const budgetData = await getBudgetStatus(userId);

    const aiText = await generateAIInsights(rawData);

    const response = {
      stats: rawData,
      insights: aiText,
      budgets: budgetData,
    };

    setCache(cacheKey, response, 5 * 60 * 1000);

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};