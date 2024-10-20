import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { Api400Error } from '../handlers/errorHandlers/customError.js';
import errorMessage from '../data/messages.json' assert { type: 'json' };
import { generateCSV } from "../utility/balancesheetUtility.js";

class ExpenseService {

  async validateParticipants(participants) {
    const validUserIds = await User.find({
      _id: { $in: participants.map((participant) => participant.user) }
    });
    return validUserIds.length === participants.length;
  }

  async calculateSplitMethod(participants, amount, splitMethod) {
    if (splitMethod === "percentage") {
      const totalPercentage = participants.reduce((sum, participant) => sum + (participant.percentage || 0), 0);
      if (totalPercentage !== 100) {
        throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
      }
      return participants.map((participant) => {
        const pAmount = (participant.percentage / 100) * amount;
        return { ...participant, amount: pAmount };
      });
    }

    if (splitMethod === "exact") {
      const totalAmount = participants.reduce((sum, participant) => sum + (participant.amount || 0), 0);
      if (totalAmount !== amount || totalAmount === undefined) {
        throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
      }
      return participants.map((participant) => {
        const percentage = (participant.amount / amount) * 100;
        return { ...participant, percentage };
      });
    }

    if (splitMethod === "equal") {
      const amountPerParticipant = amount / participants.length;
      return participants.map((participant) => ({
        ...participant,
        amount: amountPerParticipant,
        percentage: 100 / participants.length
      }));
    }

    return participants.map((participant) => ({ ...participant, status: participant.status || "pending" }));
  }

  async addExpense({ description, amount, splitMethod, participants, createdBy }) {
    const expense = await Expense.create({
      description,
      amount,
      splitMethod,
      participants,
      createdBy,
    });
    return expense;
  }

  async getAllExpenses() {
    return await Expense.find().populate("participants.user", "name email");
  }

  async getExpenseById(id) {
    return await Expense.findById(id).populate("participants.user", "name email");
  }

  async updateExpense(id, updateFields, userId) {
    const expense = await Expense.findById(id);
    if (!expense) throw new ErrorHandler("Expense not found", 404);

    const isParticipant = expense.participants.some((participant) => participant.user.toString() === userId);
    const isCreator = expense.createdBy.toString() === userId;

    if (!isParticipant && !isCreator) {
      throw new ErrorHandler("You are not authorized to update this expense", 401);
    }

    if (updateFields.status) {
      expense.participants.forEach((participant) => {
        if (participant.user.toString() === userId.toString()) {
          participant.status = updateFields.status;
        }
      });
    }

    if (isCreator) {
      if (updateFields.description) expense.description = updateFields.description;
      if (updateFields.amount) expense.amount = updateFields.amount;
      if (updateFields.splitMethod) expense.splitMethod = updateFields.splitMethod;
      if (updateFields.participants) expense.participants = updateFields.participants;
    }

    return await expense.save();
  }

  async deleteExpense(id) {
    return await Expense.findByIdAndDelete(id);
  }

  async getUserExpenses(userId) {
    return await Expense.find({ "participants.user": userId }).populate("participants.user", "name email");
  }

  async getBalanceSheet(type) {
    const expenses = await Expense.find();
    const balanceSheet = {};

    expenses.forEach((expense) => {
      expense.participants.forEach((participant) => {
        const userId = participant.user.toString();
        if (!balanceSheet[userId]) {
          balanceSheet[userId] = 0;
        }
        balanceSheet[userId] += participant.amount || (expense.amount * (participant.percentage / 100));
      });
    });

    const userDetails = await User.find({ _id: { $in: Object.keys(balanceSheet) } }).select("name email");
    const balanceSheetWithDetails = userDetails.map((user) => ({
      user: user._id,
      name: user.name,
      email: user.email,
      balance: balanceSheet[user._id.toString()],
    }));

    switch (type) {
      case "csv":
        return generateCSV(balanceSheetWithDetails);
      default:
        return balanceSheetWithDetails;
    }
  }
}

export default ExpenseService;
