const userValidators = require('./user.validator');
const eventValidators = require('./event.validator');
const bookingValidators = require('./booking.validator');
const authValidators = require('./auth.validator');
const volunteerValidators = require('./volunteer.validator');
const taskValidators = require('./task.validator');

module.exports = {
  ...userValidators,
  ...eventValidators,
  ...bookingValidators,
  ...authValidators,
  ...volunteerValidators,
  ...taskValidators,
};