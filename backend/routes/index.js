const express = require('express');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const studentRoutes = require('./student');
const workerRoutes = require('./worker');

const router = express.Router();

// public auth routes
router.use('/auth', authRoutes);

// protect register route: in production, admin should call register; you can choose to protect it
// For development, you may allow /auth/register open but change to admin-only later.

router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);
router.use('/worker', workerRoutes);

module.exports = router;
