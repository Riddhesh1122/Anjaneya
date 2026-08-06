const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qrToken: { type: String, required: true, unique: true },
    status: { type: String, enum: ['registered', 'checked_in', 'checked_out'], default: 'registered' },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isCertificateEligible: { type: Boolean, default: false },
    checkInNotes: { type: String },
    verificationSignature: { type: String },
  },
  { timestamps: true }
);

// Ensure a user can register only once per event
RegistrationSchema.index({ attendeeId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);