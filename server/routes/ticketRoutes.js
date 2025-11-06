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
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').post(protect, isHeadOrCoHead, createTicket);
router.route('/event/:eventId').get(getTicketsByEvent);
router.route('/participant/:participantId').get(getTicketsByParticipant);
router
  .route('/:id')
  .put(protect, isHeadOrCoHead, updateTicket)
  .delete(protect, isHead, deleteTicket);

module.exports = router;