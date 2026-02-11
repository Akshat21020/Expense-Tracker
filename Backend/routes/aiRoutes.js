import express from "express";
import auth from "../middleware/authMiddleware.js";
import { categorizeExpense } from "../controllers/aiController.js";

const router = express.Router();
router.post("/categorize", auth, categorizeExpense);

export default router;
