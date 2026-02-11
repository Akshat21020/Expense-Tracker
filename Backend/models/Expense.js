import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: String,
  description: String,
  date: Date,
  paymentMode: String
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
