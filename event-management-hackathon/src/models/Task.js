const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['unassigned', 'assigned', 'in_progress', 'done'], default: 'unassigned' },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
