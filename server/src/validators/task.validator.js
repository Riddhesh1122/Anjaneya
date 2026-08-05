const { z } = require('zod');

const createTaskSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  title: z.string().trim().min(1, 'Task title is required'),
  assignedTo: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional().default('pending'),
});

const updateTaskSchema = z.object({
  title: z.string().trim().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
