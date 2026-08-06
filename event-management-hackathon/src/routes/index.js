const express = require('express');
const router = express.Router();

const users = require('./users');
const events = require('./events');
const registrations = require('./registrations');
const auth = require('./auth');
const tasks = require('./tasks');
const stats = require('./stats');

router.get('/ping', (req, res) => res.json({ ok: true }));

router.use('/users', users);
router.use('/events', events);
router.use('/registrations', registrations);
router.use('/auth', auth);
router.use('/tasks', tasks);
router.use('/stats', stats);

module.exports = router;
