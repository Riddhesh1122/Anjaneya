const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const { DEFAULT_CONFIG, HTTP_STATUS, MESSAGES, BOOKING_STATUSES } = require('../constants');

const createBooking = async ({ userId, eventId }) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (event.capacity > 0 && event.registeredCount >= event.capacity) {
    throw new AppError('Event has reached full capacity', HTTP_STATUS.BAD_REQUEST);
  }

  const existing = await Registration.findOne({ user: userId, event: eventId });
  if (existing) {
    throw new AppError('You are already registered for this event', HTTP_STATUS.CONFLICT);
  }

  const ticketCode = `TICK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const registration = await Registration.create({
    user: userId,
    event: eventId,
    status: BOOKING_STATUSES.REGISTERED,
    qrCode: ticketCode,
  });

  await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

  return Registration.findById(registration._id)
    .populate('event')
    .populate('user', '-password')
    .lean();
};

const getBookings = async (filters = {}) => {
  const query = {};

  if (filters.user) {
    query.user = filters.user;
  }

  if (filters.event) {
    query.event = filters.event;
  }

  return Registration.find(query)
    .limit(DEFAULT_CONFIG.BOOKING_LIST_LIMIT)
    .populate('user', '-password')
    .populate('event')
    .sort({ createdAt: -1 })
    .lean();
};

const getMyBookings = async (userId) => {
  return Registration.find({ user: userId })
    .populate('event')
    .sort({ createdAt: -1 })
    .lean();
};

const cancelBooking = async (bookingId, userId) => {
  const registration = await Registration.findById(bookingId);

  if (!registration) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (registration.user.toString() !== userId.toString()) {
    throw new AppError('Forbidden: Cannot cancel another user booking', HTTP_STATUS.FORBIDDEN);
  }

  registration.status = BOOKING_STATUSES.CANCELLED;
  await registration.save();

  await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } });

  return { ok: true, message: 'Booking cancelled successfully' };
};

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  cancelBooking,
};