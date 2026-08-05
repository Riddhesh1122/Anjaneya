const Task = require('../models/Task');

const getTasks = async (filters = {}) => {
  const query = {};
  if (filters.eventId) query.eventId = filters.eventId;
  if (filters.status) query.status = filters.status;
  if (filters.assignedTo) query.assignedTo = filters.assignedTo;

  return Task.find(query)
    .populate('eventId', 'title venue startAt')
    .populate({
      path: 'assignedTo',
      populate: { path: 'userId', select: 'name email' },
    })
    .sort({ createdAt: -1 })
    .lean();
};

const createTask = async (data) => {
  const task = await Task.create(data);
  return Task.findById(task._id)
    .populate('eventId', 'title venue startAt')
    .populate({
      path: 'assignedTo',
      populate: { path: 'userId', select: 'name email' },
    })
    .lean();
};

const updateTask = async (id, updates) => {
  return Task.findByIdAndUpdate(id, updates, { new: true })
    .populate('eventId', 'title venue startAt')
    .populate({
      path: 'assignedTo',
      populate: { path: 'userId', select: 'name email' },
    })
    .lean();
};

const deleteTask = async (id) => {
  return Task.findByIdAndDelete(id).lean();
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
