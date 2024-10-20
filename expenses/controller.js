import ExpenseService from './service.js';

export const addExpense = async (req) => {
  const { logger } = req.locals;
  const expenseService = new ExpenseService({ logger });
  const { description, amount, splitMethod, participants } = req.body;
  const createdBy = req.userId;

  // Validate participants user IDs
  await expenseService.validateParticipants(participants);

  // Validate split method and calculate amounts/percentages
  participants = expenseService.calculateSplitMethod(participants, amount, splitMethod);

  const expense = await expenseService.addExpense({ description, amount, splitMethod, participants, createdBy });
  return { statusCode: 201, data: { message: "Expense added successfully!", expense } };
};

export const getAllExpenses = async (req) => {
  const { logger } = req.locals;
  const expenseService = new ExpenseService({ logger });

  const expenses = await expenseService.getAllExpenses();
  return { statusCode: 200, data: { message: "All expenses fetched successfully", expenses } };
};

export const getExpenseById = async (req) => {
  const { logger } = req.locals;
  const { id } = req.params;
  const expenseService = new ExpenseService({ logger });

 await expenseService.getExpenseById(id);

  return { statusCode: 200, data: { message: "Expense fetched successfully", expense } };
};

export const updateExpense = async (req) => {
  const { logger } = req.locals;
  const { id } = req.params;
  const { description, amount, splitMethod, participants, status } = req.body;
  const expenseService = new ExpenseService({ logger });

  const updatedExpense = await expenseService.updateExpense(id, { description, amount, splitMethod, participants, status }, req.userId);
  return { statusCode: 200, data: { message: "Expense updated successfully", updatedExpense } };
};

export const deleteExpense = async (req) => {
  const { logger } = req.locals;
  const { id } = req.params;
  const expenseService = new ExpenseService({ logger });

await expenseService.deleteExpense(id);

  return { statusCode: 200, data: { message: "Expense deleted successfully", expense } };
};

export const getUserExpenses = async (req) => {
  const { logger } = req.locals;
  const { userId } = req.params;
  const expenseService = new ExpenseService({ logger });

  const expenses = await expenseService.getUserExpenses(userId);
  return { statusCode: 200, data: { message: "User expenses fetched successfully", expenses } };
};

export const getBalanceSheet = async (req) => {
  const { logger } = req.locals;
  const { type } = req.body; // Expected type: 'csv'
  const expenseService = new ExpenseService({ logger });

  const balanceSheet = await expenseService.getBalanceSheet(type);
  switch (type) {
    case "csv":
      return { statusCode: 200, data: { message: "Balance sheet fetched successfully", balanceSheet } };
    default:
      return { statusCode: 200, data: { message: "Balance sheet fetched successfully", balanceSheet } };
  }
};
