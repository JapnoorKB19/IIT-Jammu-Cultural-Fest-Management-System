const express = require('express');
const router = express.Router();
const {
  assignTeamToEvent,
  getManagementByEvent,
  getManagementByTeam,
  deleteManagementAssignment,
} = require('../controllers/eventManagementController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  // Only an admin can assign a team
  .post(protect, isAdmin, assignTeamToEvent);

router
  .route('/event/:eventId')
  // Only an admin can see teams for an event
  .get(protect, isAdmin, getManagementByEvent);

router
  .route('/team/:teamId')
  // Only an admin can see events for a team
  .get(protect, isAdmin, getManagementByTeam);

router
  .route('/:id')
  // Only a SuperAdmin can delete an assignment
  .delete(protect, isSuperAdmin, deleteManagementAssignment);

module.exports = router;