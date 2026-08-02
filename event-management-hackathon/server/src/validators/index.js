const userValidators = require('./user.validator');
const eventValidators = require('./event.validator');
const bookingValidators = require('./booking.validator');
const authValidators = require('./auth.validator');

module.exports = {
  ...userValidators,
  ...eventValidators,
  ...bookingValidators,
  ...authValidators,
};