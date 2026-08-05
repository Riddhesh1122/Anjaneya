const express = require('express');
const {
  createBookingSchema,
  listBookingsQuerySchema,
  bookingIdParamsSchema,
} = require('../validators');
const { validateBody, validateQuery, validateParams } = require('../middleware/validateRequest');
const protect = require('../middleware/auth.middleware');
const { bookingController } = require('../controllers');

const router = express.Router();

router.use(protect);

router.post('/', validateBody(createBookingSchema), bookingController.createBooking);
router.get('/my-tickets', bookingController.getMyBookings);
router.get('/', validateQuery(listBookingsQuerySchema), bookingController.getBookings);
router.delete('/:id', validateParams(bookingIdParamsSchema), bookingController.cancelBooking);

module.exports = router;