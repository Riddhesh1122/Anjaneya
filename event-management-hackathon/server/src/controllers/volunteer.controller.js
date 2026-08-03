const asyncHandler = require('../utils/asyncHandler');
const volunteerService = require('../services/volunteer.service');

const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await volunteerService.getVolunteers();
  return res.json(volunteers);
});

const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await volunteerService.getVolunteerById(req.params.id);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }
  return res.json(volunteer);
});

module.exports = {
  getVolunteers,
  getVolunteerById,
};
