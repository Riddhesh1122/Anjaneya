const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User with this email already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({
    ...userData,
    email: userData.email.toLowerCase(),
  });

  const token = signToken({ id: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = signToken({ id: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

module.exports = {
  register,
  login,
  getMe,
};
