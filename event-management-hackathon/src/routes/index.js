const express = require('express');
const router = express.Router();

const users = require('./users');
const events = require('./events');
const registrations = require('./registrations');

router.get('/ping', (req, res) => res.json({ ok: true }));

router.use('/users', users);
router.use('/events', events);
router.use('/registrations', registrations);

module.exports = router;
