import axios from 'axios';

export interface EventData {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  banner?: string;
  venue: string;
  location?: string;
  date: string; // ISO
  time?: string;
  capacity: number;
  registered: number;
  registrationDeadline?: string;
  organizer: string;
  contactEmail?: string;
  contactPhone?: string;
  tags?: string[];
  rules?: string[];
}

const placeholderClient = axios.create({
  adapter: async (config) => {
    // Mock dataset
    const now = new Date();
    const events: EventData[] = [
      {
        id: 'ev1',
        title: 'Summer Tech Meetup',
        shortDescription: 'An evening of talks and networking for tech enthusiasts.',
        description:
          'Join us for the Summer Tech Meetup where industry experts will share insights on web development, AI, and startups. Networking and refreshments provided.',
        category: 'Meetup',
        banner: undefined,
        venue: 'Community Hall A',
        location: 'Downtown',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        time: '18:00',
        capacity: 200,
        registered: 124,
        registrationDeadline: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 6).toISOString(),
        organizer: 'EventOrg',
        contactEmail: 'info@eventorg.com',
        contactPhone: '+1 555 1234',
        tags: ['tech', 'networking'],
        rules: ['Bring ID', 'No outside food'],
      },
      {
        id: 'ev2',
        title: 'Volunteer Training',
        shortDescription: 'Training session for volunteers',
        description: 'Essential training for all volunteers joining upcoming events.',
        category: 'Training',
        banner: undefined,
        venue: 'Room 204',
        location: 'Community Center',
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        time: '10:00',
        capacity: 50,
        registered: 42,
        registrationDeadline: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 11).toISOString(),
        organizer: 'Community Org',
        contactEmail: 'volunteers@community.org',
        contactPhone: '+1 555 9876',
        tags: ['volunteer'],
        rules: ['Be on time'],
      },
      {
        id: 'ev3',
        title: 'Charity Concert',
        shortDescription: 'Music for a cause',
        description: 'A star-studded charity concert raising funds for local causes.',
        category: 'Concert',
        banner: undefined,
        venue: 'Open Grounds',
        location: 'City Park',
        date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        time: '20:00',
        capacity: 1000,
        registered: 580,
        registrationDeadline: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 29).toISOString(),
        organizer: 'MusicOrg',
        contactEmail: 'contact@musicorg.com',
        contactPhone: '+1 555 2222',
        tags: ['music', 'charity'],
        rules: ['No re-entry'],
      },
    ];

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    // Simulate endpoints
    if (method === 'get' && url.endsWith('/events')) {
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: events,
      } as any;
    }

    if (method === 'get' && url.match(/\/events\/[^/]+$/)) {
      const id = url.split('/').pop()!;
      const ev = events.find((e) => e.id === id);
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: ev || null,
      } as any;
    }

    if (method === 'post' && url.endsWith('/events')) {
      const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const id = `ev${events.length + 1}`;
      const newEvent: EventData = { id, ...payload };
      events.push(newEvent);
      return { status: 201, statusText: 'Created', headers: {}, config, data: newEvent } as any;
    }

    if ((method === 'put' || method === 'patch') && url.match(/\/events\/[^/]+$/)) {
      const id = url.split('/').pop()!;
      const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const idx = events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        events[idx] = { ...events[idx], ...payload } as EventData;
        return { status: 200, statusText: 'OK', headers: {}, config, data: events[idx] } as any;
      }
      return { status: 404, statusText: 'Not Found', headers: {}, config, data: null } as any;
    }

    if (method === 'delete' && url.match(/\/events\/[^/]+$/)) {
      const id = url.split('/').pop()!;
      const idx = events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        events.splice(idx, 1);
        return { status: 204, statusText: 'No Content', headers: {}, config, data: null } as any;
      }
      return { status: 404, statusText: 'Not Found', headers: {}, config, data: null } as any;
    }

    return { status: 404, statusText: 'Not Found', headers: {}, config, data: null } as any;
  },
});

export const eventApi = {
  getEvents: async (): Promise<EventData[]> => {
    const res = await placeholderClient.get('/events');
    return res.data as EventData[];
  },
  getEventById: async (id: string): Promise<EventData | null> => {
    const res = await placeholderClient.get(`/events/${id}`);
    return res.data as EventData | null;
  },
  createEvent: async (payload: Partial<EventData>): Promise<EventData> => {
    const res = await placeholderClient.post('/events', payload);
    return res.data as EventData;
  },
  updateEvent: async (id: string, payload: Partial<EventData>): Promise<EventData | null> => {
    const res = await placeholderClient.put(`/events/${id}`, payload);
    return res.data as EventData | null;
  },
  deleteEvent: async (id: string): Promise<boolean> => {
    const res = await placeholderClient.delete(`/events/${id}`);
    return res.status === 204;
  },
};
