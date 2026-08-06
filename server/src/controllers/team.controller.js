const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS } = require('../constants');
const emailService = require('../services/email.service');
const emailTemplates = require('../templates/emailTemplates');

let TeamModel;
try {
  TeamModel = require('../models/Team');
} catch (e) {
  TeamModel = null;
}

const memoryTeams = [
  {
    id: 't1',
    teamName: 'CyberShield Innovators',
    description: 'AI & Zero Trust Security Research Team',
    eventId: 'e1',
    eventTitle: 'AI & ML Innovations Summit 2026',
    leaderId: 'demo-leader',
    leaderName: 'Aarav Sharma (Team Leader)',
    inviteCode: 'TEAM-X9P2',
    minTeamSize: 2,
    maxTeamSize: 4,
    members: [
      { userId: 'demo-leader', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'Leader', joinedAt: new Date().toISOString() },
      { userId: 'u2', name: 'Priya Patel', email: 'priya@example.com', role: 'Member', joinedAt: new Date().toISOString() },
      { userId: 'u3', name: 'Rohan Verma', email: 'rohan@example.com', role: 'Member', joinedAt: new Date().toISOString() },
    ],
    status: 'Approved',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    teamName: 'Neural Net Hackers',
    description: 'Generative AI & LLM Automation Project',
    eventId: 'e2',
    eventTitle: 'Global Hackathon 2026',
    leaderId: 'demo-leader-2',
    leaderName: 'Kabir Mehta',
    inviteCode: 'TEAM-K8W4',
    minTeamSize: 2,
    maxTeamSize: 5,
    members: [
      { userId: 'demo-leader-2', name: 'Kabir Mehta', email: 'kabir@example.com', role: 'Leader', joinedAt: new Date().toISOString() },
      { userId: 'u4', name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Member', joinedAt: new Date().toISOString() },
    ],
    status: 'Submitted',
    createdAt: new Date().toISOString(),
  },
];

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TEAM-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/teams — Create Team
const createTeam = asyncHandler(async (req, res) => {
  const { teamName, description, eventId, eventTitle, minTeamSize, maxTeamSize } = req.body;
  const leaderId = req.user ? req.user._id : 'demo-user';
  const leaderName = req.user ? req.user.name : 'Team Leader';
  const leaderEmail = req.user ? req.user.email : 'leader@example.com';

  const inviteCode = generateInviteCode();
  const newTeam = {
    id: `t-${Date.now()}`,
    teamName,
    description: description || '',
    eventId: eventId || 'e1',
    eventTitle: eventTitle || 'Platform Hackathon',
    leaderId,
    leaderName,
    inviteCode,
    minTeamSize: minTeamSize || 2,
    maxTeamSize: maxTeamSize || 5,
    members: [
      { userId: leaderId, name: leaderName, email: leaderEmail, role: 'Leader', joinedAt: new Date().toISOString() }
    ],
    status: 'Forming',
    createdAt: new Date().toISOString(),
  };

  if (TeamModel && TeamModel.create) {
    try {
      const created = await TeamModel.create({
        teamName,
        description,
        eventId: eventId || 'e1',
        eventTitle,
        leaderId,
        leaderName,
        inviteCode,
        minTeamSize,
        maxTeamSize,
        members: [{ userId: leaderId, name: leaderName, email: leaderEmail, role: 'Leader' }],
        status: 'Forming',
      });
      return res.status(HTTP_STATUS.CREATED).json({ success: true, team: created });
    } catch (err) {
      console.warn('[Team DB Fallback Active]');
    }
  }

  memoryTeams.unshift(newTeam);
  return res.status(HTTP_STATUS.CREATED).json({ success: true, team: newTeam });
});

// POST /api/teams/join — Join team by invite code
const joinTeamByCode = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;
  const userId = req.user ? req.user._id : `u-${Date.now()}`;
  const userName = req.user ? req.user.name : 'New Member';
  const userEmail = req.user ? req.user.email : 'member@example.com';

  const team = memoryTeams.find(t => t.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
  if (!team) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Invalid invite code' });
  }

  if (team.members.length >= team.maxTeamSize) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Team has reached maximum capacity' });
  }

  const alreadyJoined = team.members.some(m => m.userId === userId);
  if (alreadyJoined) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'You are already a member of this team' });
  }

  team.members.push({ userId, name: userName, email: userEmail, role: 'Member', joinedAt: new Date().toISOString() });

  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Successfully joined team!', team });
});

// GET /api/teams/my-teams — Get user's teams
const getMyTeams = asyncHandler(async (req, res) => {
  return res.status(HTTP_STATUS.OK).json({ success: true, teams: memoryTeams });
});

// PUT /api/teams/:id/submit — Submit final team registration
const submitTeamRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const team = memoryTeams.find(t => t.id === id);
  if (!team) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Team not found' });
  }

  if (team.members.length < team.minTeamSize) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Team requires at least ${team.minTeamSize} members before submitting (Current: ${team.members.length})`
    });
  }

  team.status = 'Submitted';

  // Non-blocking confirmation email to team leader
  emailService.sendEmail({
    to: team.members[0].email || 'leader@example.com',
    subject: `🚀 Team Registration Submitted - ${team.teamName}`,
    html: emailTemplates.getRegistrationConfirmationTemplate({
      attendeeName: team.leaderName,
      eventTitle: team.eventTitle,
      eventDate: 'Scheduled Event Date',
      location: 'Main Venue',
      ticketId: `TEAM-${team.inviteCode}`,
    })
  });

  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Team registration submitted for review!', team });
});

// PUT /api/teams/:id/status — Organizer Approval / Rejection
const updateTeamStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const team = memoryTeams.find(t => t.id === id);
  if (!team) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Team not found' });
  }

  team.status = status;
  return res.status(HTTP_STATUS.OK).json({ success: true, message: `Team status updated to ${status}`, team });
});

module.exports = {
  createTeam,
  joinTeamByCode,
  getMyTeams,
  submitTeamRegistration,
  updateTeamStatus,
};
