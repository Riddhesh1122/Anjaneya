const { z } = require('zod');

const createVolunteerSchema = z.object({
  userId: z.string().optional(),
  eventId: z.string().min(1, 'Event ID is required'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateVolunteerSchema = z.object({
  eventId: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

module.exports = {
  createVolunteerSchema,
  updateVolunteerSchema,
};
