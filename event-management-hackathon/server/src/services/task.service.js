let tasks = [
  {
    id: 't1',
    title: 'Set up stage',
    description: 'Assemble and test sound/lighting',
    volunteerId: 'volunteer-1',
    priority: 'High',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Summer Tech Meetup',
    status: 'In Progress',
    notes: '',
  },
  {
    id: 't2',
    title: 'Ticket counter',
    description: 'Manage ticketing and entry',
    volunteerId: null,
    priority: 'Medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Community Festival',
    status: 'Pending',
    notes: '',
  },
];

const getTasks = async () => tasks;

const getTaskById = async (id) => tasks.find((task) => task.id === id) || null;

const createTask = async (taskData) => {
  const task = {
    id: `t${Date.now()}`,
    title: taskData.title,
    description: taskData.description || '',
    volunteerId: taskData.volunteerId || null,
    priority: taskData.priority || 'Medium',
    dueDate: taskData.dueDate || null,
    event: taskData.event || '',
    status: taskData.status || 'Pending',
    notes: taskData.notes || '',
  };
  tasks.push(task);
  return task;
};

const updateTask = async (id, updates) => {
  const existing = tasks.find((task) => task.id === id);
  if (!existing) return null;
  Object.assign(existing, updates);
  return existing;
};

const deleteTask = async (id) => {
  const before = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < before;
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
