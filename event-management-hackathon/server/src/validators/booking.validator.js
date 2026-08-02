const { z } = require('zod');
const { BOOKING_STATUSES } = require('../constants');

const bookingIdParamsSchema = z.object({
  id: z.string().min(1, 'Booking id is required'),
});

const createBookingSchema = z.object({
  event: z.string().optional(),
  eventId: z.string().optional(),
}).refine((data) => data.event || data.eventId, {
  message: 'Event ID is required',
  path: ['eventId'],
});

const listBookingsQuerySchema = z.object({
  user: z.string().trim().optional(),
  event: z.string().trim().optional(),
});

module.exports = {
  bookingIdParamsSchema,
  createBookingSchema,
  listBookingsQuerySchema,
};