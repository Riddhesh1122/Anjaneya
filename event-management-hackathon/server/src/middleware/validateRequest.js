const AppError = require('../utils/AppError');
const { MESSAGES, HTTP_STATUS } = require('../constants');

const formatZodError = (error) => error.issues.map((issue) => issue.message).join(', ');

const validateRequest = (schema, property = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {
    const message = formatZodError(result.error);
    return next(new AppError(message || MESSAGES.VALIDATION_FAILED, HTTP_STATUS.BAD_REQUEST));
  }

  req[property] = result.data;
  return next();
};

const validateBody = (schema) => validateRequest(schema, 'body');
const validateParams = (schema) => validateRequest(schema, 'params');
const validateQuery = (schema) => validateRequest(schema, 'query');

module.exports = {
  validateRequest,
  validateBody,
  validateParams,
  validateQuery,
};