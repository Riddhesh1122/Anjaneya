const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');

const mockRegistrations = [];

// Register a user for an event
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const reg = { _id: String(Date.now()), ...req.body, createdAt: new Date() };
      mockRegistrations.push(reg);
      return res.status(201).json(reg);
    }
    const reg = new Registration(req.body);
    await reg.save();
    res.status(201).json(reg);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// List registrations
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(mockRegistrations);
    }
    const q = {};
    if (req.query.user) q.user = req.query.user;
    if (req.query.event) q.event = req.query.event;
    const list = await Registration.find(q).limit(200).populate('user').populate('event').lean();
    res.json(list);
  } catch (err) {
    res.json(mockRegistrations);
  }
});

module.exports = router;
