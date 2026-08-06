const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['registered','cancelled'], default: 'registered' },
  checkedInAt: { type: Date, default: null },
  checkedOutAt: { type: Date, default: null },
}, { timestamps: true });

// One *active* registration per user/event — partial index so a cancelled
// registration doesn't block the same user registering again later.
RegistrationSchema.index(
  { user: 1, event: 1 },
  { unique: true, partialFilterExpression: { status: 'registered' } }
);

module.exports = mongoose.model('Registration', RegistrationSchema);
