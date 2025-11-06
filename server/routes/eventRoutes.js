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
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').get(getAllEvents).post(protect, isHeadOrCoHead, createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, isHeadOrCoHead, updateEvent)
  .delete(protect, isHead, deleteEvent);

module.exports = router;