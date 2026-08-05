const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Forbidden: You do not have permission to perform this action', HTTP_STATUS.FORBIDDEN);
    }
    next();
  };
};

module.exports = authorize;
