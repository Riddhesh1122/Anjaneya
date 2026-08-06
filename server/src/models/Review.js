const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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
    recommended: {
      type: Boolean,
      default: true,
    },
    organizerReply: {
      replyMessage: { type: String },
      repliedAt: { type: Date },
      organizerName: { type: String },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ eventId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
