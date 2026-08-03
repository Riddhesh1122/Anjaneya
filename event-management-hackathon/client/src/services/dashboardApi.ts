import axios from 'axios';

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

const placeholderClient = axios.create({
  adapter: async (config) => {
    // simple adapter that returns mocked responses based on URL
    const now = new Date();
    const events: EventItem[] = [
      {
        id: 'e1',
        name: 'Summer Tech Meetup',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        time: '18:00',
        venue: 'Community Hall',
        status: 'Upcoming',
        participants: 124,
        banner: undefined,
      },
      {
        id: 'e2',
        name: 'Volunteer Training',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        time: '10:00',
        venue: 'Room 204',
        status: 'Completed',
        participants: 42,
      },
      {
        id: 'e3',
        name: 'Charity Concert',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        time: '20:00',
        venue: 'Open Grounds',
        status: 'Upcoming',
        participants: 580,
      },
    ];

    const response = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        stats: {
          totalEvents: events.length,
          upcomingEvents: events.filter((e) => e.status === 'Upcoming').length,
          volunteers: 86,
          registrations: 746,
        },
        recentEvents: events,
        upcoming: events.filter((e) => e.status === 'Upcoming'),
        notifications: [
          { id: 'n1', text: '12 new registrations for Summer Tech Meetup' },
          { id: 'n2', text: 'Volunteer assigned to Charity Concert' },
          { id: 'n3', text: 'Payment received: Order #827' },
          { id: 'n4', text: 'Reminder: Volunteer Training tomorrow' },
        ],
      },
    } as any;

    return response;
  },
});

export const dashboardApi = {
  fetchOverview: async () => {
    const res = await placeholderClient.get('/dashboard/overview');
    return res.data;
  },
};
