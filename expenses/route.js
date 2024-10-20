import express from "express";
import requestController from "../utility/requestController.js";
import requestValidator from "../utility/requestValidator.js";
import * as validators from "./validator.js";
import * as controllers from "./controller.js";

const router = express.Router();

// Middleware to check if the user is authenticated
import { isAuthenticated } from '../middleware/auth.middleware.js';
router.use(isAuthenticated);

// Add a new expense
router.post(
  "/",
  requestValidator(validators.validateAddExpense),
  requestController(controllers.addExpense)
);

// Retrieve all expenses
router.get(
  "/",
  requestController(controllers.getAllExpenses)
);

// Retrieve an expense by ID
router.get(
  "/:id",
  requestController(controllers.getExpenseById)
);

// Update an expense
router.put(
  "/:id",
  requestValidator(validators.validateUpdateExpense),
  requestController(controllers.updateExpense)
);

// Delete an expense
router.delete(
  "/:id",
  requestController(controllers.deleteExpense)
);

// Retrieve individual user expenses
router.get(
  "/user/:userId",
  requestController(controllers.getUserExpenses)
);

export default router;
