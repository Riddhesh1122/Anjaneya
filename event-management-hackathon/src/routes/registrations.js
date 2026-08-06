const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { mockRegistrations, mockEvents, nextMockId } = require('../utils/mockStore');

// POST /api/registrations — authenticated attendees only
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { event: eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: 'event is required.' });

    if (mongoose.connection.readyState !== 1) {
      const ev = mockEvents.find((e) => String(e._id) === String(eventId));
      if (!ev) return res.status(404).json({ error: 'Event not found.' });

      const activeForEvent = mockRegistrations.filter(
        (r) => String(r.event) === String(eventId) && r.status !== 'cancelled'
      );
      const dup = activeForEvent.find((r) => String(r.user) === String(req.user.id));
      if (dup) return res.status(409).json({ error: 'Already registered for this event.' });

      const capacity = Number(ev.capacity) || 0;
      if (capacity > 0 && activeForEvent.length >= capacity) {
        return res.status(409).json({ error: 'Event has reached capacity.' });
      }

      const reg = {
        _id: nextMockId(),
        user: req.user.id,
        event: eventId,
        status: 'registered',
        checkedInAt: null,
        checkedOutAt: null,
        createdAt: new Date(),
      };
      mockRegistrations.push(reg);
      return res.status(201).json(reg);
    }

    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ error: 'Event not found.' });

    const existing = await Registration.findOne({ user: req.user.id, event: eventId, status: { $ne: 'cancelled' } });
    if (existing) return res.status(409).json({ error: 'Already registered for this event.' });

    if (ev.capacity && ev.capacity > 0) {
      const count = await Registration.countDocuments({ event: eventId, status: { $ne: 'cancelled' } });
      if (count >= ev.capacity) {
        return res.status(409).json({ error: 'Event has reached capacity.' });
      }
    }

    const reg = await Registration.create({ user: req.user.id, event: eventId });
    res.status(201).json(reg);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Already registered for this event.' });
    res.status(400).json({ error: err.message });
  }
});

// GET /api/registrations/my — the logged-in attendee's own registrations
router.get('/my', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mine = mockRegistrations.filter((r) => String(r.user) === String(req.user.id));
      const withEvents = mine.map((r) => ({
        ...r,
        event: mockEvents.find((e) => String(e._id) === String(r.event)) || r.event,
      }));
      return res.json(withEvents);
    }

    const list = await Registration.find({ user: req.user.id }).populate('event').sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/registrations — organizer listing (kept from Phase 1, unchanged behavior)
router.get('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      let list = mockRegistrations;
      if (req.query.user) list = list.filter((r) => String(r.user) === String(req.query.user));
      if (req.query.event) list = list.filter((r) => String(r.event) === String(req.query.event));
      return res.json(list);
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

// Helper: fetch a mock registration and confirm the requester may act on it.
function findMockRegOrFail(req, res) {
  const reg = mockRegistrations.find((r) => String(r._id) === String(req.params.id));
  if (!reg) {
    res.status(404).json({ error: 'Registration not found.' });
    return null;
  }
  const isOwner = String(reg.user) === String(req.user.id);
  const isStaff = ['organizer', 'admin', 'volunteer'].includes(req.user.role);
  if (!isOwner && !isStaff) {
    res.status(403).json({ error: 'Not authorized for this registration.' });
    return null;
  }
  return reg;
}

// DELETE /api/registrations/:id — attendee cancels their own registration
router.delete('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const reg = mockRegistrations.find((r) => String(r._id) === String(req.params.id));
      if (!reg) return res.status(404).json({ error: 'Registration not found.' });
      if (String(reg.user) !== String(req.user.id) && !['organizer', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'You can only cancel your own registration.' });
      }
      reg.status = 'cancelled';
      return res.json(reg);
    }

    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ error: 'Registration not found.' });
    if (String(reg.user) !== String(req.user.id) && !['organizer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You can only cancel your own registration.' });
    }
    reg.status = 'cancelled';
    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/registrations/:id/qr — QR image (PNG data URL) encoding only the registration ID.
// Generated on demand; never persisted to MongoDB.
router.get('/:id/qr', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const reg = findMockRegOrFail(req, res);
      if (!reg) return;
    } else {
      const reg = await Registration.findById(req.params.id).lean();
      if (!reg) return res.status(404).json({ error: 'Registration not found.' });
      const isOwner = String(reg.user) === String(req.user.id);
      const isStaff = ['organizer', 'admin', 'volunteer'].includes(req.user.role);
      if (!isOwner && !isStaff) return res.status(403).json({ error: 'Not authorized for this registration.' });
    }

    const dataUrl = await QRCode.toDataURL(String(req.params.id));
    res.json({ registrationId: req.params.id, qr: dataUrl });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/registrations/:id/checkin — volunteer/organizer scans the QR at the door
router.post('/:id/checkin', protect, authorize('volunteer', 'organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const reg = mockRegistrations.find((r) => String(r._id) === String(req.params.id));
      if (!reg) return res.status(404).json({ error: 'Registration not found.' });
      if (reg.status === 'cancelled') return res.status(400).json({ error: 'Registration is cancelled.' });
      if (reg.checkedInAt) return res.status(409).json({ error: 'Already checked in.' });
      reg.checkedInAt = new Date();
      return res.json(reg);
    }

    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ error: 'Registration not found.' });
    if (reg.status === 'cancelled') return res.status(400).json({ error: 'Registration is cancelled.' });
    if (reg.checkedInAt) return res.status(409).json({ error: 'Already checked in.' });
    reg.checkedInAt = new Date();
    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/registrations/:id/checkout
router.post('/:id/checkout', protect, authorize('volunteer', 'organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const reg = mockRegistrations.find((r) => String(r._id) === String(req.params.id));
      if (!reg) return res.status(404).json({ error: 'Registration not found.' });
      if (!reg.checkedInAt) return res.status(400).json({ error: 'Attendee has not checked in yet.' });
      if (reg.checkedOutAt) return res.status(409).json({ error: 'Already checked out.' });
      reg.checkedOutAt = new Date();
      return res.json(reg);
    }

    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ error: 'Registration not found.' });
    if (!reg.checkedInAt) return res.status(400).json({ error: 'Attendee has not checked in yet.' });
    if (reg.checkedOutAt) return res.status(409).json({ error: 'Already checked out.' });
    reg.checkedOutAt = new Date();
    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
