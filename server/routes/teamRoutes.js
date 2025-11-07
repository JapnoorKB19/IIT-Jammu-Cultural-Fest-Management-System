const express = require('express');
const router = express.Router();
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} = require('../controllers/teamController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllTeams) // Publicly readable list
  .post(protect, isAdmin, createTeam); // Only admins can create

router
  .route('/:id')
  .get(getTeamById) // Publicly readable
  .put(protect, isAdmin, updateTeam) // Only admins can update
  .delete(protect, isSuperAdmin, deleteTeam); // Only SuperAdmins can delete

module.exports = router;