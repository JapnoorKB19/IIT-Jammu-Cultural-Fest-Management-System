const express = require('express');
const router = express.Router();
const {
  getAllStudentMembers,
  getStudentMemberById,
  updateStudentMember,
  deleteStudentMember,
} = require('../controllers/studentMemberController');
const {
  protect,
  isHead,
  isHeadOrCoHead,
} = require('../middleware/authMiddleware');

router.route('/').get(protect, isHeadOrCoHead, getAllStudentMembers);

router
  .route('/:id')
  .get(protect, isHeadOrCoHead, getStudentMemberById)
  .put(protect, isHeadOrCoHead, updateStudentMember)
  .delete(protect, isHead, deleteStudentMember);

module.exports = router;