const express = require('express');
const router = express.Router();
const {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} = require('../controllers/participantController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  // 'createParticipant' is public, so no 'protect' middleware
  .post(createParticipant)
  // Only admins can get a list of all participants
  .get(protect, isAdmin, getAllParticipants);

router
  .route('/:id')
  // Only admins can get a single participant
  .get(protect, isAdmin, getParticipantById)
  // Only admins can update a participant
  .put(protect, isAdmin, updateParticipant)
  // Only SuperAdmins can delete a participant
  .delete(protect, isSuperAdmin, deleteParticipant);

module.exports = router;