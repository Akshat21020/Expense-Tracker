import Expense from "../models/Expense.js";
import { categorizeExpense } from "../aiServices.js"

// CREATE expense
export const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;

    const finalCategory =
      category || categorizeExpense(description);

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category: finalCategory,
      description,
      date,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });

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

    res.json({ message: "Expense removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};