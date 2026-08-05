const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const volunteerService = require('../services/volunteer.service');
const { HTTP_STATUS } = require('../constants');

const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await volunteerService.getVolunteers(req.query);
  return res.json(apiResponse('Volunteers fetched successfully', volunteers));
});

const createVolunteer = asyncHandler(async (req, res) => {
  const volunteerData = {
    userId: req.body.userId || (req.user ? req.user._id : null),
    eventId: req.body.eventId,
    status: req.body.status || 'active',
  };
  const volunteer = await volunteerService.createVolunteer(volunteerData);
  return res.status(HTTP_STATUS.CREATED).json(apiResponse('Volunteer registered successfully', volunteer));
});

const updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await volunteerService.updateVolunteer(req.params.id, req.body);
  return res.json(apiResponse('Volunteer updated successfully', volunteer));
});

const deleteVolunteer = asyncHandler(async (req, res) => {
  await volunteerService.deleteVolunteer(req.params.id);
  return res.json(apiResponse('Volunteer removed successfully', null));
});

module.exports = {
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
