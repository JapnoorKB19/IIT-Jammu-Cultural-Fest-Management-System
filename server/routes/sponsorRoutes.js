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
  isAdmin,
  isSuperAdmin
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllSponsors)
  .post(protect, isAdmin, createSponsor);
router
  .route('/:id')
  .get(getSponsorById)
  .put(protect, isAdmin, updateSponsor)
  .delete(protect, isSuperAdmin, deleteSponsor);

module.exports = router;