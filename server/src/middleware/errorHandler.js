const { HTTP_STATUS, MESSAGES } = require('../constants');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    if (error.name === 'CastError') {
      error = new AppError(MESSAGES.INVALID_ID, HTTP_STATUS.BAD_REQUEST);
    } else if (error.code === 11000) {
      error = new AppError(MESSAGES.DUPLICATE_RESOURCE, HTTP_STATUS.CONFLICT);
    } else if (error.name === 'ValidationError') {
      error = new AppError(error.message, HTTP_STATUS.BAD_REQUEST);
    } else {
      error = new AppError(MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  logger.error(err.stack || err.message || error.message);

  return res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: error.message || MESSAGES.INTERNAL_SERVER_ERROR,
  });
};

module.exports = errorHandler;