const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');

router.post('/', teamController.createTeam);
router.post('/join', teamController.joinTeamByCode);
router.get('/my-teams', teamController.getMyTeams);
router.put('/:id/submit', teamController.submitTeamRegistration);
router.put('/:id/status', teamController.updateTeamStatus);

module.exports = router;
