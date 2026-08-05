const User = require('../models/User');
const { DEFAULT_CONFIG, HTTP_STATUS, MESSAGES } = require('../constants');
const AppError = require('../utils/AppError');

const createUser = async (userData) => User.create(userData);

const getUsers = async (limit = DEFAULT_CONFIG.USER_LIST_LIMIT) => User.find().limit(limit).lean();

const getUserById = async (id) => {
  const user = await User.findById(id).lean();

  if (!user) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};