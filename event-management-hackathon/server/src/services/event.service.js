const Event = require('../models/Event');
const { DEFAULT_CONFIG, EVENT_ENUMS, HTTP_STATUS, MESSAGES } = require('../constants');
const AppError = require('../utils/AppError');

const createEvent = async (eventData, organizerId) => {
  return Event.create({
    ...eventData,
    startAt: eventData.startAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    organizer: organizerId || eventData.organizer,
  });
};

const getEvents = async (filters = {}) => {
  const query = { status: EVENT_ENUMS.EVENT_STATUSES.PUBLISHED };

  if (filters.college) {
    query.college = new RegExp(filters.college, 'i');
  }

  if (filters.category) {
    query.category = new RegExp(filters.category, 'i');
  }

  if (filters.search) {
    query.$or = [
      { title: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
      { venue: new RegExp(filters.search, 'i') },
      { category: new RegExp(filters.search, 'i') },
    ];
  }

  if (filters.tag) {
    query.tags = filters.tag;
  }

  const limit = filters.limit ? Number(filters.limit) : DEFAULT_CONFIG.EVENT_LIST_LIMIT;

  return Event.find(query)
    .sort({ startAt: 1 })
    .limit(limit)
    .populate('organizer', 'name email college')
    .lean();
};

const getEventById = async (id) => {
  const event = await Event.findById(id).populate('organizer', 'name email college').lean();

  if (!event) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return event;
};

const updateEvent = async (id, updates) => {
  const event = await Event.findByIdAndUpdate(id, updates, { new: true }).lean();

  if (!event) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id).lean();

  if (!event) {
    throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return { ok: true };
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};