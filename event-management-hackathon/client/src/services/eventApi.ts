import { apiClient, unwrapApiResponse, getApiErrorMessage } from './apiClient';

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

const toEventData = (event: any): EventData => {
  const startAt = event.startAt || event.date;
  const dateValue = startAt ? new Date(startAt).toISOString() : '';
  const timeValue = startAt ? new Date(startAt).toTimeString().slice(0, 5) : '';
  const organizerName = event.organizer?.name || event.organizerName || 'Organizer';
  const organizerEmail = event.organizer?.email || '';

  return {
    id: event._id || event.id,
    title: event.title || 'Untitled event',
    shortDescription: event.description ? event.description.slice(0, 120) : 'Event details are available on the backend.',
    description: event.description || '',
    category: event.category || 'General',
    banner: event.bannerImage || event.banner,
    venue: event.venue || 'TBA',
    location: event.venue || 'TBA',
    date: dateValue,
    time: timeValue,
    capacity: event.maxCapacity ?? 100,
    registered: event.currentRegistrations ?? event.registeredCount ?? 0,
    registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString() : undefined,
    organizer: organizerName,
    contactEmail: organizerEmail,
    contactPhone: event.contactPhone || '',
    tags: event.tags || [],
    rules: event.rules || [],
  };
};

const toBackendPayload = (payload: Partial<EventData> & Record<string, any>) => {
  if (!payload) return {};
  const start = payload.date ? new Date(payload.date) : new Date();
  const end = payload.time ? new Date(`${payload.date.split('T')[0]}T${payload.time}`) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const registrationDeadline = payload.registrationDeadline ? new Date(payload.registrationDeadline) : undefined;

  return {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    venue: payload.venue,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    registrationDeadline: registrationDeadline?.toISOString(),
    maxCapacity: payload.capacity,
    tags: payload.tags || [],
    bannerImage: payload.banner,
  };
};

export const eventApi = {
  getEvents: async (): Promise<EventData[]> => {
    try {
      const response = await apiClient.get('/events');
      const payload = unwrapApiResponse<any[]>(response.data);
      const items = Array.isArray(payload) ? payload : [];
      return items.map(toEventData);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to load events'));
    }
  },
  getEventById: async (id: string): Promise<EventData | null> => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      const payload = unwrapApiResponse<any>(response.data);
      return payload ? toEventData(payload) : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to load event'));
    }
  },
  createEvent: async (payload: Partial<EventData>): Promise<EventData> => {
    try {
      const response = await apiClient.post('/events', toBackendPayload(payload));
      const payloadData = unwrapApiResponse<any>(response.data);
      return toEventData(payloadData);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to create event'));
    }
  },
  updateEvent: async (id: string, payload: Partial<EventData>): Promise<EventData | null> => {
    try {
      const response = await apiClient.put(`/events/${id}`, toBackendPayload(payload));
      const payloadData = unwrapApiResponse<any>(response.data);
      return payloadData ? toEventData(payloadData) : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to update event'));
    }
  },
  deleteEvent: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/events/${id}`);
      return true;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to delete event'));
    }
  },
};
