const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getRegistrationsByEvent,
  getRegistrationsByParticipant,
  deleteRegistration,
} = require('../controllers/eventRegistrationController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  // Only an admin can manually create a registration
  .post(protect, isAdmin, createRegistration);

router
  .route('/event/:eventId')
  // Only an admin can get all registrations for an event
  .get(protect, isAdmin, getRegistrationsByEvent);

router
  .route('/participant/:participantId')
  // Only an admin can get all registrations for a participant
  .get(protect, isAdmin, getRegistrationsByParticipant);

router
  .route('/:id')
  // Only a SuperAdmin can delete a registration record
  .delete(protect, isSuperAdmin, deleteRegistration);

module.exports = router;