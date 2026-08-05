const express = require('express');
const { createVolunteerSchema, updateVolunteerSchema } = require('../validators');
const { validateBody } = require('../middleware/validateRequest');
const protect = require('../middleware/auth.middleware');
const { volunteerController } = require('../controllers');

const router = express.Router();

router.get('/', volunteerController.getVolunteers);
router.post('/', protect, validateBody(createVolunteerSchema), volunteerController.createVolunteer);
router.put('/:id', protect, validateBody(updateVolunteerSchema), volunteerController.updateVolunteer);
router.delete('/:id', protect, volunteerController.deleteVolunteer);

module.exports = router;
