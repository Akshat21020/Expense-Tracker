import { generateInsights, generateAIInsights } from "../services/insightServices.js";
  
  export const getInsights = async (req, res) => {
    try {
      const rawData = await generateInsights(req.user._id);
  
      const aiText = await generateAIInsights(rawData);
  
      res.json({
        stats: rawData,
        insights: aiText,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };