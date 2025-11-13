const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const {
  protect,
  isHead,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router.route('/').get(getAllEvents).post(protect, isSuperAdmin, createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, isSuperAdmin, updateEvent)
  .delete(protect, isSuperAdmin, deleteEvent);

module.exports = router;