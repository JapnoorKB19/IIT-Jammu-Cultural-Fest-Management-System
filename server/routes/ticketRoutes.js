const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTicketsByEvent,
  getTicketsByParticipant,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const {
  protect,
  isHead,
  isAdmin,
} = require('../middleware/authMiddleware');

router.route('/').post(protect, isAdmin, createTicket);
router.route('/event/:eventId').get(getTicketsByEvent);
router.route('/participant/:participantId').get(getTicketsByParticipant);
router
  .route('/:id')
  .put(protect, isAdmin, updateTicket)
  .delete(protect, isHead, isAdmin, deleteTicket);

module.exports = router;