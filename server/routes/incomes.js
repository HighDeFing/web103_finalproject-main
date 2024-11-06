import express from "express";
import IncomeController from "../controllers/incomes.js";

const router = express.Router();

// ACTUAL INCOMES
// POST request to add a new income
router.post("/actual/add", IncomeController.addIncomeActual);

// GET request to fetch all incomes for a specific budget_id
router.get("/actual", IncomeController.getIncomesActual);

// PATCH request to update an income by specific income_id
router.patch("/actual/update", IncomeController.updateIncomeActual);

// DELETE request to delete an income by specific income_id
router.delete("/actual/delete", IncomeController.deleteIncomeActual);

// PREDICTED INCOMES
// POST request to add a new income
router.post("/predicted/add", IncomeController.addIncomePredicted);

// GET request to fetch all incomes for a specific budget_id
router.get("/predicted", IncomeController.getIncomesPredicted);

// PATCH request to update an income by specific income_id
router.patch("/predicted/update", IncomeController.updateIncomePredicted);

// DELETE request to delete an income by specific income_id
router.delete("/predicted/delete", IncomeController.deleteIncomePredicted);

// RECURRENT INCOMES
// POST request to add a new income
router.post("/recurrent/add", IncomeController.addIncomeRecurrent);

// GET request to fetch all incomes for a specific budget_id
router.get("/recurrent", IncomeController.getIncomesRecurrent);

// PATCH request to update an income by specific income_id
router.patch("/recurrent/update", IncomeController.updateIncomeRecurrent);

// DELETE request to delete an income by specific income_id
router.delete("/recurrent/delete", IncomeController.deleteIncomeRecurrent);

export default router;