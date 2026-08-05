const express = require('express');
const {
  createEventSchema,
  updateEventSchema,
  eventIdParamsSchema,
  listEventsQuerySchema,
} = require('../validators');
const { validateBody, validateParams, validateQuery } = require('../middleware/validateRequest');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { eventController } = require('../controllers');
const { ROLES } = require('../constants');

const router = express.Router();

router.get('/', validateQuery(listEventsQuerySchema), eventController.getEvents);
router.get('/:id', validateParams(eventIdParamsSchema), eventController.getEventById);
router.get('/:id/analytics', protect, authorize(ROLES.ORGANIZER), validateParams(eventIdParamsSchema), eventController.getAnalytics);

module.exports = router;