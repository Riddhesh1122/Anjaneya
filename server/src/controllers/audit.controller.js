const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS } = require('../constants');

let AuditLogModel;
try {
  AuditLogModel = require('../models/AuditLog');
} catch (e) {
  AuditLogModel = null;
}

const memoryAuditLogs = [
  { id: 'al-1', userName: 'Aarav Sharma', userRole: 'organizer', action: 'LOGIN_SUCCESS', module: 'Authentication', resource: 'JWT HMAC Session', ipAddress: '192.168.1.42', createdAt: new Date().toISOString() },
  { id: 'al-2', userName: 'Aarav Sharma', userRole: 'organizer', action: 'EVENT_CREATED', module: 'Event', resource: 'AI & ML Summit 2026', ipAddress: '192.168.1.42', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'al-3', userName: 'Priya Patel', userRole: 'attendee', action: 'REGISTRATION_SUBMITTED', module: 'Registration', resource: 'Registration Pass #ANJ-82K', ipAddress: '10.0.0.12', createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: 'al-4', userName: 'Kabir Mehta', userRole: 'volunteer', action: 'QR_CHECKIN_VERIFIED', module: 'Attendance', resource: 'Attendee Check-in Gate 1', ipAddress: '192.168.1.88', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'al-5', userName: 'Aarav Sharma', userRole: 'organizer', action: 'CERTIFICATE_DISPATCHED', module: 'Certificate', resource: 'AI Certificate Batch #4', ipAddress: '192.168.1.42', createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
];

// GET /api/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { search, module: moduleFilter } = req.query;

  if (AuditLogModel && AuditLogModel.find) {
    try {
      const query = {};
      if (moduleFilter && moduleFilter !== 'All') query.module = moduleFilter;

      const logs = await AuditLogModel.find(query).sort({ createdAt: -1 }).limit(100);
      return res.status(HTTP_STATUS.OK).json({ success: true, logs });
    } catch (err) {
      console.warn('[Audit DB Fallback Mode Active]');
    }
  }

  let filtered = [...memoryAuditLogs];
  if (moduleFilter && moduleFilter !== 'All') {
    filtered = filtered.filter(l => l.module === moduleFilter);
  }
  if (search) {
    filtered = filtered.filter(l =>
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase())
    );
  }

  return res.status(HTTP_STATUS.OK).json({ success: true, logs: filtered });
});

// POST /api/audit-logs
const createAuditLog = asyncHandler(async (req, res) => {
  const { action, module: modName, resource } = req.body;
  const userName = req.user ? req.user.name : 'System User';
  const userRole = req.user ? req.user.role : 'organizer';

  const newLog = {
    id: `al-${Date.now()}`,
    userName,
    userRole,
    action,
    module: modName || 'System',
    resource: resource || 'N/A',
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString(),
  };

  memoryAuditLogs.unshift(newLog);
  return res.status(HTTP_STATUS.CREATED).json({ success: true, log: newLog });
});

module.exports = {
  getAuditLogs,
  createAuditLog,
};
