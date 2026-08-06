const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  role: { type: String, enum: ['Leader', 'Member'], default: 'Member' },
  joinedAt: { type: Date, default: Date.now },
});

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    eventTitle: {
      type: String,
      default: 'Hackathon / Summit Event',
    },
    leaderId: {
      type: String,
      required: true,
      index: true,
    },
    leaderName: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    minTeamSize: {
      type: Number,
      default: 2,
    },
    maxTeamSize: {
      type: Number,
      default: 5,
    },
    members: [memberSchema],
    status: {
      type: String,
      enum: ['Forming', 'Submitted', 'Approved', 'Rejected'],
      default: 'Forming',
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ eventId: 1, teamName: 1 });

module.exports = mongoose.model('Team', teamSchema);
