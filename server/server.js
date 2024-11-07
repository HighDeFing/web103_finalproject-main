import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.js";
import budgetRouter from "./routes/budget.js";
import expenseRouter from "./routes/expenses.js";
import incomeRouter from "./routes/incomes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/income", incomeRouter);
app.use("/", (req, res) => {
    res.send("gobudget API");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});