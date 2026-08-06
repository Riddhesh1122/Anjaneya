const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS } = require('../constants');

let ReviewModel;
try {
  ReviewModel = require('../models/Review');
} catch (e) {
  ReviewModel = null;
}

const memoryReviews = [
  {
    id: 'r1',
    eventId: 'e1',
    userId: 'u101',
    userName: 'Rohan Verma',
    userAvatar: '',
    rating: 5,
    title: 'Outstanding Keynotes & Practical AI Demos!',
    message: 'The AI Summit was extraordinarily well organized. The hands-on machine learning workshops and zero-trust security panels were world-class.',
    recommended: true,
    organizerReply: {
      replyMessage: 'Thank you Rohan! We are thrilled you enjoyed the hands-on AI workshops. Hope to see you next year!',
      repliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      organizerName: 'Aarav Sharma (Lead Organizer)',
    },
    isFeatured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'r2',
    eventId: 'e1',
    userId: 'u102',
    userName: 'Ananya Gupta',
    userAvatar: '',
    rating: 5,
    title: 'Top Tier Networking & Volunteer Management',
    message: 'Check-in via QR pass was instant! Great energy, amazing speakers, and seamless logistics.',
    recommended: true,
    organizerReply: null,
    isFeatured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'r3',
    eventId: 'e1',
    userId: 'u103',
    userName: 'Vikram Joshi',
    userAvatar: '',
    rating: 4,
    title: 'Insightful Sessions & Great Agenda',
    message: 'Loved the LLM optimization panel. Would appreciate even more Q&A time during future sessions.',
    recommended: true,
    organizerReply: null,
    isFeatured: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

// GET /api/reviews/event/:eventId
const getEventReviews = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  let reviewsList = memoryReviews.filter(r => r.eventId === eventId || eventId === 'e1');
  if (ReviewModel && ReviewModel.find) {
    try {
      const dbReviews = await ReviewModel.find({ eventId }).sort({ createdAt: -1 });
      if (dbReviews && dbReviews.length > 0) reviewsList = dbReviews;
    } catch (err) {
      console.warn('[Review DB Fallback Active]');
    }
  }

  const totalReviews = reviewsList.length;
  const avgRating = totalReviews > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';
  const recCount = reviewsList.filter(r => r.recommended).length;
  const recommendPct = totalReviews > 0 ? Math.round((recCount / totalReviews) * 100) : 100;

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    summary: {
      totalReviews,
      avgRating: Number(avgRating),
      recommendPct,
    },
    reviews: reviewsList,
  });
});

// POST /api/reviews — Submit review
const submitReview = asyncHandler(async (req, res) => {
  const { eventId, rating, title, message, recommended } = req.body;
  const userId = req.user ? req.user._id : 'demo-user';
  const userName = req.user ? req.user.name : 'Aarav Sharma';

  const newReview = {
    id: `r-${Date.now()}`,
    eventId: eventId || 'e1',
    userId,
    userName,
    userAvatar: '',
    rating: Number(rating) || 5,
    title,
    message,
    recommended: recommended !== undefined ? Boolean(recommended) : true,
    organizerReply: null,
    isFeatured: Number(rating) === 5,
    createdAt: new Date().toISOString(),
  };

  if (ReviewModel && ReviewModel.create) {
    try {
      const created = await ReviewModel.create(newReview);
      return res.status(HTTP_STATUS.CREATED).json({ success: true, review: created });
    } catch (err) {
      console.warn('[Review DB Fallback Active]');
    }
  }

  memoryReviews.unshift(newReview);
  return res.status(HTTP_STATUS.CREATED).json({ success: true, review: newReview });
});

// POST /api/reviews/:id/reply — Organizer Reply
const replyToReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;
  const organizerName = req.user ? req.user.name : 'Aarav Sharma (Lead Organizer)';

  const review = memoryReviews.find(r => r.id === id);
  if (!review) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Review not found' });
  }

  review.organizerReply = {
    replyMessage,
    repliedAt: new Date().toISOString(),
    organizerName,
  };

  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Organizer reply added!', review });
});

module.exports = {
  getEventReviews,
  submitReview,
  replyToReview,
};
