const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Register a user for an event
router.post('/', async (req, res) => {
  try {
    const reg = new Registration(req.body);
    await reg.save();
    res.status(201).json(reg);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// List registrations
router.get('/', async (req, res) => {
  const q = {};
  if (req.query.user) q.user = req.query.user;
  if (req.query.event) q.event = req.query.event;
  const list = await Registration.find(q).limit(200).populate('user').populate('event').lean();
  res.json(list);
});

module.exports = router;
