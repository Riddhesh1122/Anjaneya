const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create event
router.post('/', async (req, res) => {
  try {
    const ev = new Event(req.body);
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List events (published)
router.get('/', async (req, res) => {
  const q = { status: 'published' };
  if (req.query.college) q.college = req.query.college;
  const list = await Event.find(q).sort({ startAt: 1 }).limit(100).lean();
  res.json(list);
});

// Get event
router.get('/:id', async (req, res) => {
  const ev = await Event.findById(req.params.id).lean();
  if (!ev) return res.status(404).json({ error: 'Not found' });
  res.json(ev);
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ev);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete event
router.delete('/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
