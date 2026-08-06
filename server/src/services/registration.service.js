const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const QRCode = require('qrcode');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { JWT_SECRET } = require('../constants');

const SECRET_KEY = process.env.JWT_SECRET || JWT_SECRET || 'anjaneya-secret-key-development-12345';

// Generate HMAC signature to prevent QR forgery
function generateSignature(payload) {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${payload.eventId}:${payload.attendeeId}:${payload.iat}`)
    .digest('hex');
}

// Create a registration document and generate a signed QR token + image
async function createRegistration(eventId, attendeeId) {
  const existing = await Registration.findOne({ eventId, attendeeId });
  if (existing) {
    throw new Error('User already registered for this event');
  }

  const iat = Math.floor(Date.now() / 1000);
  const payload = { eventId: eventId.toString(), attendeeId: attendeeId.toString(), iat };
  const signature = generateSignature(payload);
  const qrToken = jwt.sign({ ...payload, sig: signature }, SECRET_KEY, { expiresIn: '365d' });

  // Generate QR code as data URL (PNG)
  const qrImage = await QRCode.toDataURL(qrToken);

  const registration = await Registration.create({
    eventId,
    attendeeId,
    qrToken,
    verificationSignature: signature,
    status: 'registered',
  });

  // Increment event registered attendees count
  try {
    await Event.findByIdAndUpdate(eventId, { $inc: { attendees: 1 } });
  } catch (e) {}

  return { registrationId: registration._id, qrToken, qrImage };
}

async function getRegistrationsByAttendee(attendeeId) {
  return Registration.find({ attendeeId }).populate('eventId', 'title date location category price');
}

async function getRegistrationsByEvent(eventId) {
  return Registration.find({ eventId }).populate('attendeeId', 'name email role');
}

/**
 * Validates signed QR token and performs secure check-in
 */
async function verifyAndCheckInQR({ qrToken, scannerUser, eventIdTarget }) {
  let decoded;
  try {
    decoded = jwt.verify(qrToken, SECRET_KEY);
  } catch (err) {
    throw new Error('Invalid or forged QR token signature');
  }

  const { eventId, attendeeId, sig } = decoded;

  // Validate HMAC signature
  const expectedSig = generateSignature({ eventId, attendeeId, iat: decoded.iat });
  if (sig && sig !== expectedSig) {
    throw new Error('Tampered QR code detected. Verification failed.');
  }

  // Find registration in database
  const registration = await Registration.findOne({ qrToken })
    .populate('attendeeId', 'name email role')
    .populate('eventId', 'title date location category');

  if (!registration) {
    throw new Error('Registration record not found');
  }

  // Check event match
  if (eventIdTarget && registration.eventId._id.toString() !== eventIdTarget.toString()) {
    throw new Error(`This QR code belongs to "${registration.eventId.title}", not the current event.`);
  }

  // Duplicate Check-in Guard
  if (registration.status === 'checked_in') {
    const formattedTime = registration.checkInTime
      ? new Date(registration.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'earlier';
    throw new Error(`Duplicate Check-in Rejected! Attendee "${registration.attendeeId?.name || 'User'}" already checked in at ${formattedTime}.`);
  }

  // Update check-in status and certificate eligibility
  registration.status = 'checked_in';
  registration.checkInTime = new Date();
  registration.scannedBy = scannerUser ? scannerUser._id : null;
  registration.isCertificateEligible = true;
  await registration.save();

  return registration;
}

async function updateStatusByToken(qrToken, newStatus, scannerUser) {
  return verifyAndCheckInQR({ qrToken, scannerUser });
}

module.exports = {
  createRegistration,
  getRegistrationsByAttendee,
  getRegistrationsByEvent,
  verifyAndCheckInQR,
  updateStatusByToken,
};
