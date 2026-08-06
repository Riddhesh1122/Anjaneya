const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { mockEvents, mockRegistrations, mockTasks, mockUsers } = require('../utils/mockStore');

// GET /api/stats/dashboard — aggregate platform numbers for the organizer/admin
// dashboard. Works identically in offline/mock mode and MongoDB mode.
router.get('/dashboard', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const activeRegs = mockRegistrations.filter((r) => r.status !== 'cancelled');
      const checkedIn = activeRegs.filter((r) => r.checkedInAt && !r.checkedOutAt).length;
      const checkedOut = activeRegs.filter((r) => r.checkedOutAt).length;
      return res.json({
        totalEvents: mockEvents.length,
        publishedEvents: mockEvents.filter((e) => e.status === 'published').length,
        totalRegistrations: activeRegs.length,
        checkedIn,
        checkedOut,
        totalVolunteers: mockUsers.filter((u) => u.role === 'volunteer').length,
        totalTasks: mockTasks.length,
        completedTasks: mockTasks.filter((t) => t.status === 'done').length,
      });
    }

    const [totalEvents, publishedEvents, totalRegistrations, checkedIn, checkedOut, totalVolunteers, totalTasks, completedTasks] =
      await Promise.all([
        Event.countDocuments({}),
        Event.countDocuments({ status: 'published' }),
        Registration.countDocuments({ status: { $ne: 'cancelled' } }),
        Registration.countDocuments({ checkedInAt: { $ne: null }, checkedOutAt: null }),
        Registration.countDocuments({ checkedOutAt: { $ne: null } }),
        User.countDocuments({ role: 'volunteer' }),
        Task.countDocuments({}),
        Task.countDocuments({ status: 'done' }),
      ]);

    res.json({
      totalEvents,
      publishedEvents,
      totalRegistrations,
      checkedIn,
      checkedOut,
      totalVolunteers,
      totalTasks,
      completedTasks,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
