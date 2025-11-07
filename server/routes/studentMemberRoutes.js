const express = require('express');
const router = express.Router();
const {
  getAllStudentMembers,
  getStudentMemberById,
  updateStudentMember,
  deleteStudentMember,
} = require('../controllers/studentMemberController');

// Import the correct admin middleware
const {
  protect,
  isAdmin,
  isSuperAdmin,
} = require('../middleware/authMiddleware');

// Only Admins can see the list of all members
router.route('/').get(protect, isAdmin, getAllStudentMembers);

router
  .route('/:id')
  // Only Admins can get a single member's details
  .get(protect, isAdmin, getStudentMemberById)
  // Only Admins can update a member (e.g., change their team/role)
  .put(protect, isAdmin, updateStudentMember)
  // Only SuperAdmins can delete a member
  .delete(protect, isSuperAdmin, deleteStudentMember);

module.exports = router;