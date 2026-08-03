import { apiClient, unwrapApiResponse, getApiErrorMessage } from './apiClient';

export interface EventItem {
  id: string;
  name: string;
  date: string;
  time?: string;
  venue: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  participants: number;
  banner?: string;
}

const toDashboardEvent = (event: any): EventItem => {
  const startAt = event.startAt || event.date;
  const date = startAt ? new Date(startAt).toISOString() : '';
  const status = new Date(startAt) > new Date() ? 'Upcoming' : 'Completed';
  return {
    id: event._id || event.id,
    name: event.title || 'Untitled event',
    date,
    time: startAt ? new Date(startAt).toTimeString().slice(0, 5) : '',
    venue: event.venue || 'TBA',
    status,
    participants: event.currentRegistrations || 0,
    banner: event.bannerImage || event.banner,
  };
};

export const dashboardApi = {
  fetchOverview: async () => {
    try {
      const [eventsResponse, usersResponse] = await Promise.all([
        apiClient.get('/events'),
        apiClient.get('/users'),
      ]);
      const events = (unwrapApiResponse<any[]>(eventsResponse.data) || []).map(toDashboardEvent);
      const users = unwrapApiResponse<any[]>(usersResponse.data) || [];
      const volunteers = users.filter((u: any) => (u.role || '').toLowerCase() === 'volunteer').length;
      const upcomingEvents = events.filter((event) => event.status === 'Upcoming');
      const registrations = events.reduce((sum, event) => sum + event.participants, 0);

      return {
        stats: {
          totalEvents: events.length,
          upcomingEvents: upcomingEvents.length,
          volunteers,
          registrations,
        },
        recentEvents: events.slice(0, 4),
        upcoming: upcomingEvents.slice(0, 3),
        notifications: [
          { id: 'n1', text: `${registrations} registrations across your events` },
          { id: 'n2', text: `${volunteers} active volunteers are available` },
          { id: 'n3', text: 'Task board and volunteer assignments are synced from the backend.' },
        ],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to load dashboard overview'));
    }
  },
};
