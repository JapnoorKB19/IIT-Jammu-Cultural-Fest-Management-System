const express = require('express');
const router = express.Router();
const {
  createPerformer,
  getAllPerformers,
  getPerformerById,
  updatePerformer,
  deletePerformer,
} = require('../controllers/performerController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllPerformers)
  .post(protect, isHeadOrCoHead, createPerformer);
router
  .route('/:id')
  .get(getPerformerById)
  .put(protect, isHeadOrCoHead, updatePerformer)
  .delete(protect, isHead, deletePerformer);

module.exports = router;