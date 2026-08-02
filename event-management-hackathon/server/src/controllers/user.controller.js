const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');
const { HTTP_STATUS } = require('../constants');

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(HTTP_STATUS.CREATED).json(user);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();
  return res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.json(user);
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
};