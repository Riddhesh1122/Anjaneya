const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, authorize } = require('../middleware/auth');
const { mockEvents, mockRegistrations } = require('../utils/mockStore');

// Create event (organizer/admin only)
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    if (!req.body || !req.body.title) {
      return res.status(400).json({ error: 'title is required.' });
    }
    if (mongoose.connection.readyState !== 1) {
      const newEv = { _id: String(Date.now()), ...req.body, status: req.body.status || 'published' };
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

// Update event (organizer/admin only)
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockEvents.findIndex(e => e._id === req.params.id);
      if (idx !== -1) {
        mockEvents[idx] = { ...mockEvents[idx], ...req.body };
        return res.json(mockEvents[idx]);
      }
      return res.status(404).json({ error: 'Not found' });
    }
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ev) return res.status(404).json({ error: 'Not found' });
    res.json(ev);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete event (organizer/admin only)
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
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

// Attendance summary for an event (organizer only)
router.get('/:id/attendance', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const regs = mockRegistrations.filter(
        (r) => String(r.event) === String(req.params.id) && r.status !== 'cancelled'
      );
      const checkedIn = regs.filter((r) => r.checkedInAt && !r.checkedOutAt).length;
      const checkedOut = regs.filter((r) => r.checkedOutAt).length;
      const registered = regs.length;
      return res.json({
        eventId: req.params.id,
        registered,
        checkedIn,
        checkedOut,
        notArrived: registered - checkedIn - checkedOut,
      });
    }

    const regs = await Registration.find({ event: req.params.id, status: { $ne: 'cancelled' } }).lean();
    const registered = regs.length;
    const checkedIn = regs.filter((r) => r.checkedInAt && !r.checkedOutAt).length;
    const checkedOut = regs.filter((r) => r.checkedOutAt).length;
    res.json({
      eventId: req.params.id,
      registered,
      checkedIn,
      checkedOut,
      notArrived: registered - checkedIn - checkedOut,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
