const userController = require('./user.controller');
const registrationController = require('./registration.controller');
const eventController = require('./event.controller');
const bookingController = require('./booking.controller');
const authController = require('./auth.controller');

module.exports = {
  userController,
  eventController,
  bookingController,
  registrationController,
  authController,
};