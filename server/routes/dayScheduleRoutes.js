const express = require('express');
const router = express.Router();
const {
  createDay,
  getAllDays,
  getDayById,
  updateDay,
  deleteDay,
} = require('../controllers/dayScheduleController');
const {
  protect,
  isHead,
  isAdmin,
} = require('../middleware/authMiddleware');

router.route('/').get(getAllDays).post(protect, isAdmin, createDay);
router
  .route('/:id')
  .get(getDayById)
  .put(protect, isAdmin, updateDay)
  .delete(protect, isHead, isAdmin, deleteDay);

module.exports = router;