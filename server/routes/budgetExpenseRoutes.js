const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/budgetExpenseController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, isAdmin, getAllExpenses) // Only admins can see the budget
  .post(protect, isAdmin, createExpense); // Only admins can add expenses

router
  .route('/:id')
  .get(protect, isAdmin, getExpenseById) // Only admins can see a single expense
  .put(protect, isAdmin, updateExpense) // Only admins can update
  .delete(protect, isSuperAdmin, deleteExpense); // Only SuperAdmins can delete

module.exports = router;