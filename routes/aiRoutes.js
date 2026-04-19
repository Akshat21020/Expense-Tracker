import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getInsights } from "../controllers/aiController.js";

const router = express.Router();

router.get("/insights", protect, getInsights);

export default router;