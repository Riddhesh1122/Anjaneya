const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Mock in-memory events for offline mode
const mockEvents = [
  { _id: '1', title: 'AI Innovations Hackathon 2026', description: 'Build cutting-edge AI agents and apps.', college: 'MIT Tech', category: 'AI/ML', startAt: '2026-09-15', status: 'published' },
  { _id: '2', title: 'Web3 & DeFi Summit', description: 'Create next-gen decentralized applications.', college: 'Stanford University', category: 'Blockchain', startAt: '2026-10-01', status: 'published' },
  { _id: '3', title: 'Green Tech Innovation Challenge', description: 'Develop sustainable solutions for climate action.', college: 'UC Berkeley', category: 'Sustainability', startAt: '2026-10-20', status: 'published' }
];

// Create event
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newEv = { _id: String(Date.now()), ...req.body, status: 'published' };
      mockEvents.push(newEv);
      return res.status(201).json(newEv);
    }
    const ev = new Event(req.body);
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List events (published)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(mockEvents);
    }
    const q = { status: 'published' };
    if (req.query.college) q.college = req.query.college;
    const list = await Event.find(q).sort({ startAt: 1 }).limit(100).lean();
    res.json(list);
  } catch (err) {
    res.json(mockEvents);
  }
});

// Get event
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const found = mockEvents.find(e => e._id === req.params.id);
      return found ? res.json(found) : res.status(404).json({ error: 'Not found' });
    }
    const ev = await Event.findById(req.params.id).lean();
    if (!ev) return res.status(404).json({ error: 'Not found' });
    res.json(ev);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockEvents.findIndex(e => e._id === req.params.id);
      if (idx !== -1) {
        mockEvents[idx] = { ...mockEvents[idx], ...req.body };
        return res.json(mockEvents[idx]);
      }
    }
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ev);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockEvents.findIndex(e => e._id === req.params.id);
      if (idx !== -1) mockEvents.splice(idx, 1);
      return res.json({ ok: true });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: true });
  }
});

module.exports = router;
