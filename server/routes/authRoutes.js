const express = require('express');
const router = express.Router();
const {
  registerStudentMember,
  loginStudentMember,
} = require('../controllers/authController');
const { protect, isHead } = require('../middleware/authMiddleware');

router.post('/member/register', protect, isHead, registerStudentMember);
router.post('/member/login', loginStudentMember);

module.exports = router;