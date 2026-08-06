const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: ['admin', 'organizer', 'volunteer', 'attendee'],
      default: 'attendee',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Success', 'Info', 'Warning', 'Error'],
      default: 'Info',
    },
    category: {
      type: String,
      enum: ['Event', 'Registration', 'Volunteer', 'Attendance', 'Announcement', 'Certificate', 'Reminder', 'System'],
      default: 'Event',
    },
    relatedEventId: {
      type: String,
    },
    relatedRegistrationId: {
      type: String,
    },
    actionUrl: {
      type: String,
      default: '/dashboard',
    },
    readStatus: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user notification queries
notificationSchema.index({ userId: 1, readStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
