const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create user (signup)
router.post('/', async (req, res) => {
  try {
    const u = new User(req.body);
    await u.save();
    res.status(201).json(u);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List users
router.get('/', async (req, res) => {
  const users = await User.find().limit(50).lean();
  res.json(users);
});

// Get user
router.get('/:id', async (req, res) => {
  const u = await User.findById(req.params.id).lean();
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json(u);
});

module.exports = router;
