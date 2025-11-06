const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getRegistrationsByEvent,
  getRegistrationsByParticipant,
  deleteRegistration,
} = require('../controllers/eventRegistrationController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').post(protect, isHeadOrCoHead, createRegistration);
router.route('/event/:eventId').get(getRegistrationsByEvent);
router
  .route('/participant/:participantId')
  .get(getRegistrationsByParticipant);
router.route('/:id').delete(protect, isHead, deleteRegistration);

module.exports = router;