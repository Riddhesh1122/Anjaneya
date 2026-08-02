// src/mocks/users.ts
import { User } from '../types/User';
import { Role } from '../types/Role';

export const users: User[] = [
  {
    id: 'u1',
    createdAt: new Date().toISOString(),
    name: 'Alice Guest',
    email: 'alice@example.com',
    role: Role.GUEST,
  },
  {
    id: 'u2',
    createdAt: new Date().toISOString(),
    name: 'Bob Student',
    email: 'bob@example.com',
    role: Role.STUDENT,
    college: 'University of Example',
  },
  {
    id: 'u3',
    createdAt: new Date().toISOString(),
    name: 'Carol Organizer',
    email: 'carol@example.com',
    role: Role.ORGANIZER,
  },
  {
    id: 'u4',
    createdAt: new Date().toISOString(),
    name: 'Dave Admin',
    email: 'dave@example.com',
    role: Role.ADMIN,
  },
];
