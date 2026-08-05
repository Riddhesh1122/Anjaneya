const mongoose = require('mongoose');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError(MESSAGES.UNAUTHORIZED || 'Not authorized, token missing', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = verifyToken(token);

    // If demo token or MongoDB connection is offline
    if (mongoose.connection.readyState !== 1 || (typeof decoded.id === 'string' && decoded.id.startsWith('demo-'))) {
      req.user = {
        _id: decoded.id,
        name: decoded.name || 'Demo User',
        email: decoded.email || 'user@example.com',
        role: decoded.role || 'attendee',
      };
      return next();
    }

    // Try finding real user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      // Fallback for valid JWT with demo user payload
      req.user = {
        _id: decoded.id,
        name: 'Demo User',
        email: 'user@example.com',
        role: decoded.role || 'attendee',
      };
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED);
  }
});

module.exports = protect;
