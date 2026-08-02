const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');
const registrationRoutes = require('./registration.routes');
const paymentRoutes = require('./payment.routes');
const adminRoutes = require('./admin.routes');
const volunteerRoutes = require('./volunteer.routes');
const taskRoutes = require('./task.routes');

const router = express.Router();

router.get('/ping', (req, res) => res.json({ ok: true }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/registrations', registrationRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;