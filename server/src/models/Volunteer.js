const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    tasksAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

// Ensure a user can be a volunteer for an event only once
VolunteerSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Volunteer', VolunteerSchema);
