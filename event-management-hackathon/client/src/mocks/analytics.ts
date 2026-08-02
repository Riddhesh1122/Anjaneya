// src/mocks/analytics.ts
import { Analytics } from '../types/Analytics';
import { events } from './events';

export const analytics: Analytics[] = events.map((event) => ({
  eventId: event.id,
  attendance: Math.floor(event.registeredCount * 0.8), // assume 80% attendance
  registrations: event.registeredCount,
  views: Math.floor(event.registeredCount * 5), // arbitrary view count
  revenue: undefined,
  growthMetrics: {
    dailyRegistrations: Math.floor(event.registeredCount / 10),
    weeklyRegistrations: Math.floor(event.registeredCount / 2),
  },
}));
