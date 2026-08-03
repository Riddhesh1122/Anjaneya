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
router.post('/', protect, authorize(ROLES.ORGANIZER), validateBody(createEventSchema), eventController.createEvent);
router.get('/:id', validateParams(eventIdParamsSchema), eventController.getEventById);
router.put('/:id', protect, authorize(ROLES.ORGANIZER), validateParams(eventIdParamsSchema), validateBody(updateEventSchema), eventController.updateEvent);
router.delete('/:id', protect, authorize(ROLES.ORGANIZER), validateParams(eventIdParamsSchema), eventController.deleteEvent);

module.exports = router;