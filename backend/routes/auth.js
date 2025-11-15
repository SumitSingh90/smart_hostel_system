const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();

// register: only admin should create other users. You can still have an open route but better protect it.
// For simplicity we'll allow admin only (middleware applied at route mount)
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
