const express = require('express');
const protect = require('../middleware/auth.middleware');
const { volunteerController } = require('../controllers');

const router = express.Router();

router.get('/', protect, volunteerController.getVolunteers);
router.get('/:id', protect, volunteerController.getVolunteerById);

module.exports = router;
