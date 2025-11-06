const express = require('express');
const router = express.Router();
const {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  updateSponsor,
  deleteSponsor,
} = require('../controllers/sponsorController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllSponsors)
  .post(protect, isHeadOrCoHead, createSponsor);
router
  .route('/:id')
  .get(getSponsorById)
  .put(protect, isHeadOrCoHead, updateSponsor)
  .delete(protect, isHead, deleteSponsor);

module.exports = router;