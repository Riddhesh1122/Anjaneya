const asyncHandler = require('../utils/asyncHandler');
const { authService } = require('../services');
const { HTTP_STATUS } = require('../constants');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(HTTP_STATUS.CREATED).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return res.json(result);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  return res.json(user);
});

module.exports = {
  register,
  login,
  getMe,
};
