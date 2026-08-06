// Shared in-memory data used by every route module when MongoDB is not
// connected (offline/demo mode). Centralized here so that features that
// need to cross-reference each other in mock mode (e.g. registrations
// checking event capacity, tasks checking a volunteer exists) all read
// from the same arrays instead of disconnected per-route copies.

const mockUsers = [];

const mockEvents = [
  { _id: '1', title: 'AI Innovations Hackathon 2026', description: 'Build cutting-edge AI agents and apps.', college: 'MIT Tech', category: 'AI/ML', startAt: '2026-09-15', capacity: 200, status: 'published' },
  { _id: '2', title: 'Web3 & DeFi Summit', description: 'Create next-gen decentralized applications.', college: 'Stanford University', category: 'Blockchain', startAt: '2026-10-01', capacity: 150, status: 'published' },
  { _id: '3', title: 'Green Tech Innovation Challenge', description: 'Develop sustainable solutions for climate action.', college: 'UC Berkeley', category: 'Sustainability', startAt: '2026-10-20', capacity: 100, status: 'published' },
];

const mockRegistrations = [];

const mockTasks = [];

let mockIdCounter = 1000;
function nextMockId() {
  mockIdCounter += 1;
  return `m${Date.now()}${mockIdCounter}`;
}

module.exports = {
  mockUsers,
  mockEvents,
  mockRegistrations,
  mockTasks,
  nextMockId,
};
