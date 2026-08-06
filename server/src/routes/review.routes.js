const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.get('/event/:eventId', reviewController.getEventReviews);
router.post('/', reviewController.submitReview);
router.post('/:id/reply', reviewController.replyToReview);

module.exports = router;
