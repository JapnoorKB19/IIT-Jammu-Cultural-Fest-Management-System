const express = require('express');
const router = express.Router();
const {
  createDay,
  getAllDays,
  getDayById,
  updateDay,
  deleteDay,
} = require('../controllers/dayScheduleController');

// We must import isSuperAdmin
const {
  protect,
  isAdmin,
  isSuperAdmin, 
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllDays)
  .post(protect, isAdmin, createDay); // 'isAdmin' is correct here

router
  .route('/:id')
  .get(getDayById)
  .put(protect, isAdmin, updateDay) // 'isAdmin' is correct here
  .delete(protect, isSuperAdmin, deleteDay); // FIX: This must be 'isSuperAdmin'

module.exports = router;