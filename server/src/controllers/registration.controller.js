const asyncHandler = require('../utils/asyncHandler');
const registrationService = require('../services/registration.service');
const { HTTP_STATUS } = require('../constants');

// POST /events/:id/register - attendee registers for an event, receives QR token
const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const attendeeId = req.user._id; // auth middleware ensures attendee role
  const result = await registrationService.createRegistration(eventId, attendeeId);
  // result includes qrToken and qrImage (data URL)
  return res.status(HTTP_STATUS.CREATED).json(result);
});

// GET /registrations/me - attendee's own registrations
const getMyRegistrations = asyncHandler(async (req, res) => {
  const attendeeId = req.user._id;
  const regs = await registrationService.getRegistrationsByAttendee(attendeeId);
  res.json(regs);
});

// GET /events/:id/registrations - organizer view
const getEventRegistrations = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const regs = await registrationService.getRegistrationsByEvent(eventId);
  res.json(regs);
});

// POST /checkin - volunteer scans QR token
const checkIn = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;
  const updated = await registrationService.updateStatusByToken(qrToken, 'checked_in');
  // Emit socket event to organizer (if needed)
  const io = req.app.get('io');
  if (io) {
    io.emit('attendanceUpdate', { eventId: updated.eventId });
  }
  res.json(updated);
});

// POST /checkout - volunteer scans QR token
const checkOut = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;
  const updated = await registrationService.updateStatusByToken(qrToken, 'checked_out');
  const io = req.app.get('io');
  if (io) {
    io.emit('attendanceUpdate', { eventId: updated.eventId });
  }
  res.json(updated);
});

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  checkIn,
  checkOut,
};
