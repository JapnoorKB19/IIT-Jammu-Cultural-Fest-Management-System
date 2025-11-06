const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/budgetExpenseController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllExpenses)
  .post(protect, isHeadOrCoHead, createExpense);
router
  .route('/:id')
  .get(getExpenseById)
  .put(protect, isHeadOrCoHead, updateExpense)
  .delete(protect, isHead, deleteExpense);

module.exports = router;