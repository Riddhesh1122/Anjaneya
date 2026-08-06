const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { mockUsers } = require('../utils/mockStore');

// Never leak password hashes to clients, in either storage mode.
function sanitize(u) {
  if (!u) return u;
  const { password, passwordHash, ...safe } = u;
  return safe;
}

// Create user (admin-only direct creation — regular signup is POST /api/auth/register,
// which properly hashes passwords and issues a token).
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    if (mongoose.connection.readyState !== 1) {
      const u = { _id: String(Date.now()), ...body };
      mockUsers.push(u);
      return res.status(201).json(sanitize(u));
    }
    const u = new User(body);
    await u.save();
    res.status(201).json(sanitize(u.toObject()));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List users (any authenticated user — e.g. organizers picking a volunteer)
router.get('/', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(mockUsers.map(sanitize));
    }
    const users = await User.find().select('-password').limit(50).lean();
    res.json(users);
  } catch (err) {
    res.json(mockUsers.map(sanitize));
  }
});

// Get user
router.get('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const u = mockUsers.find(x => x._id === req.params.id);
      return u ? res.json(sanitize(u)) : res.status(404).json({ error: 'Not found' });
    }
    const u = await User.findById(req.params.id).select('-password').lean();
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json(u);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
