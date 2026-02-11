import app from "./app.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/ai", aiRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
