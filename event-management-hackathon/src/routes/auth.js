const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, signToken } = require('../middleware/auth');
const { mockUsers, nextMockId } = require('../utils/mockStore');

// Roles an attendee may self-select at signup. 'admin' is never
// self-assignable; promote to admin manually in the database.
const SELF_SIGNUP_ROLES = ['student', 'organizer', 'volunteer'];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college } = req.body;
    let { role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required.' });
    }
    role = SELF_SIGNUP_ROLES.includes(role) ? role : 'student';

    const passwordHash = await bcrypt.hash(password, 10);

    if (mongoose.connection.readyState !== 1) {
      const exists = mockUsers.find((u) => u.email === email);
      if (exists) return res.status(409).json({ error: 'Email already registered.' });
      const user = { _id: nextMockId(), name, email, college, role, passwordHash };
      mockUsers.push(user);
      const token = signToken(user);
      return res.status(201).json({ token, user: { id: user._id, name, email, college, role } });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const user = await User.create({ name, email, password: passwordHash, college, role });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, college: user.college, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find((u) => u.email === email);
      if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
      const ok = await bcrypt.compare(password, user.passwordHash || '');
      if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
      const token = signToken(user);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, college: user.college, role: user.role },
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, college: user.college, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
