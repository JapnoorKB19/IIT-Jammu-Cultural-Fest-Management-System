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
  isAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllSponsors)
  .post(protect, isAdmin, createSponsor);
router
  .route('/:id')
  .get(getSponsorById)
  .put(protect, isAdmin, updateSponsor)
  .delete(protect, isHead, isAdmin, deleteSponsor);

module.exports = router;