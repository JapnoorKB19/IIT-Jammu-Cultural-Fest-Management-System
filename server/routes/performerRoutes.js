const express = require('express');
const router = express.Router();
const {
  createPerformer,
  getAllPerformers,
  getPerformerById,
  updatePerformer,
  deletePerformer,
} = require('../controllers/performerController');

// Import the new 'isAdmin' and 'isSuperAdmin'
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllPerformers)
  .post(protect, isAdmin, createPerformer); // Use 'isAdmin'

router
  .route('/:id')
  .get(getPerformerById)
  .put(protect, isAdmin, updatePerformer) // Use 'isAdmin'
  .delete(protect, isSuperAdmin, deletePerformer); // Use 'isSuperAdmin'

module.exports = router;