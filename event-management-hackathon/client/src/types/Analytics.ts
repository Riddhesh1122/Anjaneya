// src/types/Analytics.ts
export interface Analytics {
  eventId: string;
  attendance: number; // total attendees
  registrations: number; // total registrations
  views: number; // page views for the event
  revenue?: number; // optional revenue, if paid events
  growthMetrics?: {
    dailyRegistrations?: number;
    weeklyRegistrations?: number;
  };
}
