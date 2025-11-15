const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /auth/register
 * Admin will call this to create users (admin/student/worker)
 */
const registerUser = async (req, res, next) => {
  try {
    const { role, name, email, password, studentId, workerId, roomNo, workerRole } = req.body;
    if (!role || !name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields', data: null });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already in use', data: null });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
      role
    });

    if (role === 'student') {
      newUser.studentId = studentId || `S${Date.now() % 10000}`;
      newUser.roomNo = roomNo || '';
    } else if (role === 'worker') {
      newUser.workerId = workerId || `W${Date.now() % 10000}`;
      newUser.workerRole = workerRole || 'cleaning';
    }

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully', data: null });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/login
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required', data: null });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          workerId: user.workerId
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };
