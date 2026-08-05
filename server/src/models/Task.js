const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
