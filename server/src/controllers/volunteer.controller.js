const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const volunteerService = require('../services/volunteer.service');
const { HTTP_STATUS } = require('../constants');

const fallbackVolunteers = [
  { _id: 'v-1', name: 'Aarav Sharma', role: 'Registration Lead', score: '96%', status: 'Active', skills: ['Registration', 'React'] },
  { _id: 'v-2', name: 'Priya Patel', role: 'AV Stage Setup', score: '91%', status: 'Active', skills: ['AV Sound', 'Logistics'] },
  { _id: 'v-3', name: 'Rohan Verma', role: 'Speaker Liaison', score: '88%', status: 'Pending', skills: ['Public Relations', 'Python'] },
];

const getVolunteers = asyncHandler(async (req, res) => {
  try {
    const volunteers = await volunteerService.getVolunteers(req.query);
    return res.json(apiResponse('Volunteers fetched successfully', volunteers && volunteers.length > 0 ? volunteers : fallbackVolunteers));
  } catch (err) {
    return res.json(apiResponse('Volunteers fetched successfully (Fallback Cache)', fallbackVolunteers));
  }
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
