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
  isAdmin,
} = require('../middleware/authMiddleware');

router.route('/').get(getAllEvents).post(protect, isAdmin, createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, isAdmin, updateEvent)
  .delete(protect, isHead,isAdmin, deleteEvent);

module.exports = router;