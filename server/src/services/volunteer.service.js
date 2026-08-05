const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

const getVolunteers = async (filters = {}) => {
  const query = {};
  if (filters.eventId) query.eventId = filters.eventId;
  if (filters.status) query.status = filters.status;

  return Volunteer.find(query)
    .populate('userId', 'name email college role')
    .populate('eventId', 'title startAt venue')
    .populate('tasksAssigned', 'title status')
    .sort({ createdAt: -1 })
    .lean();
};

const createVolunteer = async (data) => {
  const volunteer = await Volunteer.create(data);
  return Volunteer.findById(volunteer._id)
    .populate('userId', 'name email college role')
    .populate('eventId', 'title startAt venue')
    .lean();
};

const updateVolunteer = async (id, updates) => {
  return Volunteer.findByIdAndUpdate(id, updates, { new: true })
    .populate('userId', 'name email college role')
    .populate('eventId', 'title startAt venue')
    .lean();
};

const deleteVolunteer = async (id) => {
  return Volunteer.findByIdAndDelete(id).lean();
};

const getVolunteerCount = async () => {
  return Volunteer.countDocuments({ status: 'active' });
};

module.exports = {
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getVolunteerCount,
};
