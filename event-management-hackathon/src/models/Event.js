const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startAt: { type: Date },
  endAt: { type: Date },
  venue: { type: String },
  college: { type: String },
  capacity: { type: Number, default: 0 },
  status: { type: String, enum: ['pending','published','cancelled'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
