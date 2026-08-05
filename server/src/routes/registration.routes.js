const express = require('express');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { validateBody, validateParams } = require('../middleware/validateRequest');
const { ROLES } = require('../constants');
const { registrationController } = require('../controllers');

const router = express.Router();

// Attendee registers for an event and receives a QR token
router.post('/events/:id/register',
  protect,
  authorize(ROLES.ATTENDEE),
  validateParams({ id: 'objectId' }), // simple param validation placeholder
  registrationController.registerForEvent
);

// Attendee fetches their own registrations
router.get('/registrations/me',
  protect,
  authorize(ROLES.ATTENDEE),
  registrationController.getMyRegistrations
);

// Organizer fetches all registrations for a specific event
router.get('/events/:id/registrations',
  protect,
  authorize(ROLES.ORGANIZER),
  validateParams({ id: 'objectId' }),
  registrationController.getEventRegistrations
);

// Volunteer checks in a QR token
router.post('/checkin',
  protect,
  authorize(ROLES.VOLUNTEER),
  validateBody({ qrToken: { type: 'string', required: true } }),
  registrationController.checkIn
);

// Volunteer checks out a QR token
router.post('/checkout',
  protect,
  authorize(ROLES.VOLUNTEER),
  validateBody({ qrToken: { type: 'string', required: true } }),
  registrationController.checkOut
);

module.exports = router;
