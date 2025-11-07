const express = require('express');
const router = express.Router();
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require('../controllers/venueControllers');

// Import the new 'isAdmin' and remove the old 'isHeadOrCoHead'
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllVenues)
  .post(protect, isAdmin, createVenue); // Use 'isAdmin'

router
  .route('/:id')
  .get(getVenueById)
  .put(protect, isAdmin, updateVenue) // Use 'isAdmin'
  .delete(protect, isSuperAdmin, deleteVenue);

module.exports = router;