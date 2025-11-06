const express = require('express');
const router = express.Router();
const {
  assignTeamToEvent,
  getManagementByEvent,
  getManagementByTeam,
  deleteManagementAssignment,
} = require('../controllers/eventManagementController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').post(protect, isHeadOrCoHead, assignTeamToEvent);
router.route('/event/:eventId').get(getManagementByEvent);
router.route('/team/:teamId').get(getManagementByTeam);
router.route('/:id').delete(protect, isHead, deleteManagementAssignment);

module.exports = router;