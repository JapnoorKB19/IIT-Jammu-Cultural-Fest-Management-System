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
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').get(getAllDays).post(protect, isHeadOrCoHead, createDay);
router
  .route('/:id')
  .get(getDayById)
  .put(protect, isHeadOrCoHead, updateDay)
  .delete(protect, isHead, deleteDay);

module.exports = router;