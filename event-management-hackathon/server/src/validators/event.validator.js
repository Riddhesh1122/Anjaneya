const { z } = require('zod');
const { EVENT_STATUSES } = require('../constants');

const eventIdParamsSchema = z.object({
  id: z.string().min(1, 'Event id is required'),
});

const listEventsQuerySchema = z.object({
  college: z.string().trim().optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  limit: z.coerce.number().optional(),
});

const createEventSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  venue: z.string().trim().optional(),
  college: z.string().trim().optional(),
  capacity: z.coerce.number().int().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
  category: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(Object.values(EVENT_STATUSES)).optional().default(EVENT_STATUSES.PUBLISHED),
});

const updateEventSchema = createEventSchema.partial();

module.exports = {
  eventIdParamsSchema,
  listEventsQuerySchema,
  createEventSchema,
  updateEventSchema,
};