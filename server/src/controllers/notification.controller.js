const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// In-memory fallback notifications store if MongoDB is offline in dev
const memoryNotifications = [
  { id: 'n1', userId: 'demo', userRole: 'organizer', title: 'AI Matching Completed', message: 'Matched 3 volunteers for AI & ML Summit', type: 'Success', category: 'Volunteer', actionUrl: 'volunteers', readStatus: false, createdAt: new Date().toISOString() },
  { id: 'n2', userId: 'demo', userRole: 'organizer', title: 'Global Hackathon Capacity Warning', message: 'Registration reached 80% capacity (280/350)', type: 'Warning', category: 'Event', actionUrl: 'events', readStatus: false, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'n3', userId: 'demo', userRole: 'organizer', title: 'QR Code Ticket Scan Activity', message: '115 attendees checked in at venue gate', type: 'Info', category: 'Attendance', actionUrl: 'scanner', readStatus: true, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'n4', userId: 'demo', userRole: 'organizer', title: 'Certificates Dispatched', message: 'AI certificate batch issued to attendees', type: 'Success', category: 'Certificate', actionUrl: 'events', readStatus: true, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

let NotificationModel;
try {
  NotificationModel = require('../models/Notification');
} catch (e) {
  NotificationModel = null;
}

// GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : 'demo';
  const { category, type, unreadOnly } = req.query;

  if (NotificationModel && NotificationModel.find) {
    try {
      const query = { userId };
      if (category) query.category = category;
      if (type) query.type = type;
      if (unreadOnly === 'true') query.readStatus = false;

      const notifications = await NotificationModel.find(query).sort({ createdAt: -1 }).limit(50);
      return res.status(HTTP_STATUS.OK).json({ success: true, data: notifications });
    } catch (err) {
      console.warn('[Notification DB Fallback Mode Active]');
    }
  }

  let filtered = [...memoryNotifications];
  if (category) filtered = filtered.filter(n => n.category === category);
  if (type) filtered = filtered.filter(n => n.type === type);
  if (unreadOnly === 'true') filtered = filtered.filter(n => !n.readStatus);

  return res.status(HTTP_STATUS.OK).json({ success: true, data: filtered });
});

// GET /api/notifications/unread-count
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : 'demo';

  if (NotificationModel && NotificationModel.countDocuments) {
    try {
      const count = await NotificationModel.countDocuments({ userId, readStatus: false });
      return res.status(HTTP_STATUS.OK).json({ success: true, count });
    } catch (err) {
      // Fallback
    }
  }

  const count = memoryNotifications.filter(n => !n.readStatus).length;
  return res.status(HTTP_STATUS.OK).json({ success: true, count });
});

// PUT /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (NotificationModel && NotificationModel.findByIdAndUpdate) {
    try {
      await NotificationModel.findByIdAndUpdate(id, { readStatus: true });
    } catch (err) {
      // Fallback
    }
  }

  const notif = memoryNotifications.find(n => n.id === id);
  if (notif) notif.readStatus = true;

  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'Notification marked as read' });
});

// PUT /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : 'demo';

  if (NotificationModel && NotificationModel.updateMany) {
    try {
      await NotificationModel.updateMany({ userId }, { readStatus: true });
    } catch (err) {
      // Fallback
    }
  }

  memoryNotifications.forEach(n => (n.readStatus = true));
  return res.status(HTTP_STATUS.OK).json({ success: true, message: 'All notifications marked as read' });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
