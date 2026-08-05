const mongoose = require('mongoose');
const { EVENT_STATUSES, EVENT_VISIBILITIES, EVENT_MODES } = require('../constants');

const EventSchema = new mongoose.Schema(
  {
    // Core fields
    title: { type: String, required: true },
    description: { type: String },
    // Timing fields
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    registrationDeadline: { type: Date },
    // Location / mode
    venue: { type: String },
    mode: { type: String, enum: Object.values(EVENT_MODES), default: EVENT_MODES.ONLINE },
    // Organizer & categorisation
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: Object.values(require('../constants').EVENT_CATEGORIES) },
    // Media
    bannerImage: { type: String }, // URL or file path
    // Capacity & registration tracking
    maxCapacity: { type: Number, min: 0 },
    currentRegistrations: { type: Number, default: 0, min: 0 },
    // Tags
    tags: [{ type: String }],
    // Status & visibility
    status: { type: String, enum: Object.values(EVENT_STATUSES), default: EVENT_STATUSES.DRAFT },
    visibility: { type: String, enum: Object.values(EVENT_VISIBILITIES), default: EVENT_VISIBILITIES.PUBLIC },
  },
  { timestamps: true }
);

// Indexes for common query patterns
EventSchema.index({ title: 'text' });
EventSchema.index({ category: 1 });
EventSchema.index({ startAt: 1 });
EventSchema.index({ organizerId: 1 });
EventSchema.index({ status: 1 });

// Virtual: registration open check
EventSchema.virtual('isRegistrationOpen').get(function () {
  if (this.status !== EVENT_STATUSES.PUBLISHED) return false;
  const now = new Date();
  if (this.registrationDeadline && now > this.registrationDeadline) return false;
  if (this.maxCapacity && this.currentRegistrations >= this.maxCapacity) return false;
  return true;
});

module.exports = mongoose.model('Event', EventSchema);