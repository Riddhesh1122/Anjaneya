const asyncHandler = require('../utils/asyncHandler');
const taskService = require('../services/task.service');

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks();
  return res.json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body);
  return res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const deleted = await taskService.deleteTask(req.params.id);
  return res.json({ deleted });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
