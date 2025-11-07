const express = require('express');
const router = express.Router();
const {
  registerStudentMember,
  loginStudentMember,
  loginParticipant, // Import the new function
} = require('../controllers/authController');

const { protect, isSuperAdmin } = require('../middleware/authMiddleware');

// === Admin Auth Routes ===
router.post('/member/register', protect, isSuperAdmin, registerStudentMember);
router.post('/member/login', loginStudentMember);

// === Participant Auth Route ===
router.post('/participant/login', loginParticipant); // Add the new route

module.exports = router;