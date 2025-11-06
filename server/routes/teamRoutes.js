const express = require('express');
const router = express.Router();
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} = require('../controllers/teamController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').get(getAllTeams).post(protect, isHeadOrCoHead, createTeam);
router
  .route('/:id')
  .get(getTeamById)
  .put(protect, isHeadOrCoHead, updateTeam)
  .delete(protect, isHead, deleteTeam);

module.exports = router;