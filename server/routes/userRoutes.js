const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require('../controllers/userController');

router.get('/me', auth, getUserProfile);
router.patch('/me', auth, updateUserProfile);
router.delete('/me', auth, deleteUserProfile);

module.exports = router;



