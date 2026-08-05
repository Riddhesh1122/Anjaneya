const EVENT_STATUSES = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
});

const EVENT_VISIBILITIES = Object.freeze({
  PUBLIC: 'public',
  PRIVATE: 'private'
});

const EVENT_MODES = Object.freeze({
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
});

module.exports = { EVENT_STATUSES, EVENT_VISIBILITIES, EVENT_MODES };
