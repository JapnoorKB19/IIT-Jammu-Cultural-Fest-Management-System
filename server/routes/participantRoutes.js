const express = require('express');
const router = express.Router();
const {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} = require('../controllers/participantController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, isHeadOrCoHead, getAllParticipants)
  .post(createParticipant);
router
  .route('/:id')
  .get(protect, isHeadOrCoHead, getParticipantById)
  .put(protect, isHeadOrCoHead, updateParticipant)
  .delete(protect, isHead, deleteParticipant);

module.exports = router;