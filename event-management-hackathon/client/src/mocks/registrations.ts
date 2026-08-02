// src/mocks/registrations.ts
import { Registration } from '../types/Registration';
import { users } from './users';
import { events } from './events';

export const registrations: Registration[] = [
  {
    id: 'r1',
    createdAt: new Date().toISOString(),
    userId: users[1].id, // Bob Student
    eventId: events[0].id,
    registeredAt: new Date().toISOString(),
    status: 'registered',
  },
  {
    id: 'r2',
    createdAt: new Date().toISOString(),
    userId: users[2].id, // Carol Organizer
    eventId: events[1].id,
    registeredAt: new Date().toISOString(),
    status: 'registered',
  },
];
