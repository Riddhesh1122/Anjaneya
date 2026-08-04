const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

const mockUsers = [];

// Create user (signup)
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const u = { _id: String(Date.now()), ...req.body };
      mockUsers.push(u);
      return res.status(201).json(u);
    }
    const u = new User(req.body);
    await u.save();
    res.status(201).json(u);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List users
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(mockUsers);
    }
    const users = await User.find().limit(50).lean();
    res.json(users);
  } catch (err) {
    res.json(mockUsers);
  }
});

// Get user
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const u = mockUsers.find(x => x._id === req.params.id);
      return u ? res.json(u) : res.status(404).json({ error: 'Not found' });
    }
    const u = await User.findById(req.params.id).lean();
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json(u);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
