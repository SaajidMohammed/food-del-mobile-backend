const express = require('express');
const { getUserProfile, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile); // ✅ For profile.tsx
router.delete('/delete', verifyToken, deleteUser);   // ✅ For account deletion

module.exports = router;
