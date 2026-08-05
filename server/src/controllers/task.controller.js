const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const taskService = require('../services/task.service');
const { HTTP_STATUS } = require('../constants');

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.query);
  return res.json(apiResponse('Tasks fetched successfully', tasks));
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body);
  return res.status(HTTP_STATUS.CREATED).json(apiResponse('Task created successfully', task));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  return res.json(apiResponse('Task updated successfully', task));
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  return res.json(apiResponse('Task deleted successfully', null));
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
