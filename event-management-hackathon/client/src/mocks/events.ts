// src/mocks/events.ts
import { Event, EventStatus } from '../types/Event';
import { Category } from '../types/Category';

export const events: Event[] = [
  {
    id: 'e1',
    createdAt: new Date().toISOString(),
    title: 'Tech Talk: AI Futures',
    description: 'A deep dive into AI trends and future technologies.',
    category: Category.TECH,
    bannerImage: '/images/ai-futures.jpg',
    organizerId: 'u3', // Carol Organizer
    date: '2024-11-15',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Main Auditorium',
    capacity: 200,
    registeredCount: 57,
    status: 'published' as EventStatus,
  },
  {
    id: 'e2',
    createdAt: new Date().toISOString(),
    title: 'Cultural Fest',
    description: 'Celebrating diverse cultures on campus.',
    category: Category.CULTURAL,
    bannerImage: '/images/cultural-fest.jpg',
    organizerId: 'u3',
    date: '2024-12-01',
    startTime: '09:00',
    endTime: '18:00',
    venue: 'Open Grounds',
    capacity: 500,
    registeredCount: 240,
    status: 'draft' as EventStatus,
  },
];
