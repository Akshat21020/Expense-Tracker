import Expense from "../models/Expense.js";
import { categorizeExpenseAI } from "../services/aiServices.js";
import { deleteCache } from "../utils/cache.js";


export const invalidateInsightsCache = (userId) => {
  const now = new Date();
  const key = `insights:${userId}:${now.getFullYear()}-${now.getMonth()}`;
  deleteCache(key);
};

// CREATE expense
export const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    let finalCategory = category;

    if (!category && description) {
      finalCategory = await categorizeExpenseAI(description);
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category: finalCategory,
      description,
      date,
    });

    invalidateInsightsCache(req.user._id);

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET expenses
export const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const query = { user: req.user._id };

    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    invalidateInsightsCache(req.user._id);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await expense.deleteOne();

    invalidateInsightsCache(req.user._id);

    res.json({ message: "Expense removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

