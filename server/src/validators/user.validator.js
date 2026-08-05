const { z } = require('zod');
const { ROLES } = require('../constants');

const userIdParamsSchema = z.object({
  id: z.string().min(1, 'User id is required'),
});

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Email is invalid'),
  password: z.string().optional(),
  college: z.string().trim().optional(),
  role: z.enum(Object.values(ROLES)).optional().default(ROLES.ATTENDEE),
});

module.exports = {
  userIdParamsSchema,
  createUserSchema,
};