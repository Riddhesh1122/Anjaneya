const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const Registration = require('../models/Registration');
const { JWT_SECRET } = require('../constants');

// Create a registration document and generate a signed QR token + image
async function createRegistration(eventId, attendeeId) {
  // Ensure unique registration (unique index defined)
  const existing = await Registration.findOne({ eventId, attendeeId });
  if (existing) {
    throw new Error('User already registered for this event');
  }

  const payload = { eventId: eventId.toString(), attendeeId: attendeeId.toString() };
  const qrToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' }); // long‑lived token

  // Generate QR code as data URL (PNG)
  const qrImage = await QRCode.toDataURL(qrToken);

  const registration = await Registration.create({
    eventId,
    attendeeId,
    qrToken,
    status: 'registered',
  });

  return { registrationId: registration._id, qrToken, qrImage };
}

async function getRegistrationsByAttendee(attendeeId) {
  return Registration.find({ attendeeId }).populate('eventId', 'title date venue');
}

async function getRegistrationsByEvent(eventId) {
  return Registration.find({ eventId }).populate('attendeeId', 'name email');
}

async function updateStatusByToken(qrToken, newStatus) {
  const registration = await Registration.findOne({ qrToken });
  if (!registration) {
    throw new Error('Invalid QR token');
  }
  registration.status = newStatus;
  if (newStatus === 'checked_in') registration.checkInTime = new Date();
  if (newStatus === 'checked_out') registration.checkOutTime = new Date();
  await registration.save();
  return registration;
}

module.exports = {
  createRegistration,
  getRegistrationsByAttendee,
  getRegistrationsByEvent,
  updateStatusByToken,
};
