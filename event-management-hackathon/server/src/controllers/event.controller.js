const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const eventService = require('../services/event.service');
const { HTTP_STATUS } = require('../constants');

// Create Event (handles banner upload)
const createEvent = asyncHandler(async (req, res) => {
  const organizerId = req.user ? req.user._id : null;
  if (req.file) {
    req.body.bannerImage = req.file.path.replace(/\\/g, '/'); // Normalize path
  }
  const event = await eventService.createEvent(req.body, organizerId);
  return res.status(HTTP_STATUS.CREATED).json(apiResponse('Event created successfully', event));
});

// Get list of events with filters
const getEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getEvents(req.query);
  return res.json(apiResponse('Events fetched successfully', events));
});

// Get single event by ID
const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  return res.json(apiResponse('Event fetched successfully', event));
});

// Update event (banner optional)
const updateEvent = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.bannerImage = req.file.path.replace(/\\/g, '/');
  }
  const event = await eventService.updateEvent(req.params.id, req.body);
  return res.json(apiResponse('Event updated successfully', event));
});

// Delete event
const deleteEvent = asyncHandler(async (req, res) => {
  const result = await eventService.deleteEvent(req.params.id);
  return res.json(apiResponse('Event deleted successfully', result));
});

// Publish event (organizer only)
const publishEvent = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const event = await eventService.publishEvent(req.params.id, userId);
  return res.json(apiResponse('Event published successfully', event));
});

// Cancel event (organizer only)
const cancelEvent = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const event = await eventService.cancelEvent(req.params.id, userId);
  return res.json(apiResponse('Event cancelled successfully', event));
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
};

// Duplicated legacy controller code removed