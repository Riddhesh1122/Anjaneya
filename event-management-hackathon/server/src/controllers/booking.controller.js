const asyncHandler = require('../utils/asyncHandler');
const bookingService = require('../services/booking.service');
const { HTTP_STATUS } = require('../constants');

const createBooking = asyncHandler(async (req, res) => {
  const eventId = req.body.eventId || req.body.event;
  const userId = req.user ? req.user._id : req.body.user;

  const registration = await bookingService.createBooking({ userId, eventId });
  return res.status(HTTP_STATUS.CREATED).json(registration);
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getBookings(req.query);
  return res.json(bookings);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user._id);
  return res.json(bookings);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const result = await bookingService.cancelBooking(req.params.id, req.user._id);
  return res.json(result);
});

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  cancelBooking,
};