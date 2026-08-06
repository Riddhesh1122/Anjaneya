const asyncHandler = require('../utils/asyncHandler');
const registrationService = require('../services/registration.service');
const emailService = require('../services/email.service');
const emailTemplates = require('../templates/emailTemplates');
const { HTTP_STATUS } = require('../constants');

// POST /events/:id/register - attendee registers for an event, receives QR token
const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const attendeeId = req.user ? req.user._id : 'demo-attendee';
  const attendeeEmail = req.user ? req.user.email : 'user@example.com';
  const attendeeName = req.user ? req.user.name : 'Attendee';

  const result = await registrationService.createRegistration(eventId, attendeeId);

  // Non-blocking background email dispatch
  const html = emailTemplates.getRegistrationConfirmationTemplate({
    attendeeName,
    eventTitle: 'Platform Event',
    eventDate: 'Upcoming Date',
    location: 'Main Venue',
    ticketId: `ANJ-${result.registrationId.toString().substring(0, 6).toUpperCase()}`,
  });
  emailService.sendEmail({
    to: attendeeEmail,
    subject: '🎉 Registration Confirmed - Anjaneya Pass',
    html,
  });

  // Broadcast real-time socket registration event
  const io = req.app.get('io');
  if (io) {
    io.emit('event:capacity_update', { eventId });
    io.emit('registration:new', { eventId, attendeeId });
  }

  return res.status(HTTP_STATUS.CREATED).json(result);
});

// GET /registrations/me - attendee's own registrations
const getMyRegistrations = asyncHandler(async (req, res) => {
  const attendeeId = req.user ? req.user._id : 'demo-attendee';
  const regs = await registrationService.getRegistrationsByAttendee(attendeeId);
  res.json(regs);
});

// GET /events/:id/registrations - organizer view
const getEventRegistrations = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const regs = await registrationService.getRegistrationsByEvent(eventId);
  res.json(regs);
});

// POST /checkin - volunteer or organizer scans QR token
const checkIn = asyncHandler(async (req, res) => {
  const { qrToken, eventId } = req.body;
  const scannerUser = req.user || null;

  try {
    const updated = await registrationService.verifyAndCheckInQR({
      qrToken,
      scannerUser,
      eventIdTarget: eventId,
    });

    // Broadcast Socket.IO real-time event updates
    const io = req.app.get('io');
    if (io) {
      io.emit('attendanceUpdate', {
        eventId: updated.eventId?._id || updated.eventId,
        attendeeName: updated.attendeeId?.name,
        status: 'checked_in',
        time: updated.checkInTime,
      });
      io.emit('registration:status_change', {
        registrationId: updated._id,
        attendeeId: updated.attendeeId?._id,
        status: 'checked_in',
      });
    }

    return res.json({
      success: true,
      message: `Check-in successful! Attendee ${updated.attendeeId?.name || 'User'} marked checked in.`,
      registration: updated,
    });
  } catch (err) {
    return res.status(HTTP_STATUS.BAD_REQUEST || 400).json({
      success: false,
      message: err.message || 'Check-in verification failed.',
    });
  }
});

// POST /checkout - volunteer or organizer scans QR token
const checkOut = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;
  const updated = await registrationService.updateStatusByToken(qrToken, 'checked_out', req.user);
  const io = req.app.get('io');
  if (io) {
    io.emit('attendanceUpdate', { eventId: updated.eventId, status: 'checked_out' });
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
