const express = require('express');
const router = express.Router();
const {
  addSponsorToEvent,
  getSponsorshipsByEvent,
  getSponsorshipsBySponsor,
  updateSponsorship,
  deleteSponsorship,
} = require('../controllers/eventSponsorshipController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  // Only an admin can link a sponsor to an event
  .post(protect, isAdmin, addSponsorToEvent);

router
  .route('/event/:eventId')
  // Only an admin can see sponsorships for an event
  .get(protect, isAdmin, getSponsorshipsByEvent);

router
  .route('/sponsor/:sponsorId')
  // Only an admin can see events for a sponsor
  .get(protect, isAdmin, getSponsorshipsBySponsor);

router
  .route('/:id')
  // Only an admin can update the contribution amount
  .put(protect, isAdmin, updateSponsorship)
  // Only a SuperAdmin can delete a sponsorship link
  .delete(protect, isSuperAdmin, deleteSponsorship);

module.exports = router;