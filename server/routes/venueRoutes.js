const express = require('express');
const router = express.Router();
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require('../controllers/venueControllers');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllVenues)
  .post(protect, isHeadOrCoHead, createVenue);
router
  .route('/:id')
  .get(getVenueById)
  .put(protect, isHeadOrCoHead, updateVenue)
  .delete(protect, isHead, deleteVenue);

module.exports = router;