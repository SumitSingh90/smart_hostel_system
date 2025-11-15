const jwt = require('jsonwebtoken');
const User = require('../models/User');

const respondUnauthorized = (res) => res.status(401).json({
  success: false,
  message: 'Unauthorized',
  data: null
});

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return respondUnauthorized(res);

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return respondUnauthorized(res);

    req.user = user;
    next();
  } catch (err) {
    return respondUnauthorized(res);
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) return respondUnauthorized(res);
  if (req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: insufficient privileges',
      data: null
    });
  }
  next();
};

module.exports = { verifyToken, requireRole };
