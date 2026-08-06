const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ['admin', 'organizer', 'volunteer', 'attendee'],
      default: 'attendee',
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: ['Authentication', 'Event', 'Registration', 'Attendance', 'Volunteer', 'Certificate', 'System'],
      required: true,
      index: true,
    },
    resource: {
      type: String,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
