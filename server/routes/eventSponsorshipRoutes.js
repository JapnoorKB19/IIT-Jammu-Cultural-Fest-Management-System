const express = require('express');
const router = express.Router();
const {
  addSponsorToEvent,
  getSponsorshipsByEvent,
  getSponsorshipsBySponsor,
  updateSponsorship,
  deleteSponsorship,
} = require('../controllers/eventSponsorshipController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').post(protect, isHeadOrCoHead, addSponsorToEvent);
router.route('/event/:eventId').get(getSponsorshipsByEvent);
router.route('/sponsor/:sponsorId').get(getSponsorshipsBySponsor);
router
  .route('/:id')
  .put(protect, isHeadOrCoHead, updateSponsorship)
  .delete(protect, isHead, deleteSponsorship);

module.exports = router;