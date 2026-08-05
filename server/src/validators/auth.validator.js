const { z } = require('zod');
const { ROLES } = require('../constants');

const loginSchema = z.object({
  email: z.string().trim().email('Email is invalid'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Email is invalid'),
  password: z.string().min(1, 'Password is required'),
  college: z.string().trim().optional(),
  role: z.enum(Object.values(ROLES)).optional().default(ROLES.ATTENDEE),
});

module.exports = {
  loginSchema,
  registerSchema,
};