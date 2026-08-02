// src/services/event.service.ts
import { apiClient, ApiResponse } from './apiClient';
import { Event, EventStatus } from '../types/Event';
import { events as mockEvents } from '../mocks/events';
import { Category } from '../types/Category';

/**
 * Mock Event service that operates on the in‑memory `mockEvents` array.
 * In a real application this would make HTTP requests to a backend.
 */
export const eventService = {
  /** Get all events */
  getEvents(): Promise<ApiResponse<Event[]>> {
    return apiClient.get(mockEvents, 'Events fetched successfully');
  },

  /** Get a single event by its id */
  getEvent(id: string): Promise<ApiResponse<Event | undefined>> {
    const ev = mockEvents.find((e) => e.id === id);
    return apiClient.get(ev, ev ? 'Event fetched' : 'Event not found');
  },

  /** Create a new event (adds to the mock array) */
  createEvent(newEvent: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>): Promise<ApiResponse<Event>> {
    const id = `e${mockEvents.length + 1}`;
    const event: Event = {
      id,
      createdAt: new Date().toISOString(),
      registeredCount: 0,
      ...newEvent,
    } as Event; // cast because newEvent lacks some optional fields
    (mockEvents as Event[]).push(event);
    return apiClient.mutate(event, 'Event created');
  },

  /** Update an existing event */
  updateEvent(id: string, updates: Partial<Event>): Promise<ApiResponse<Event | undefined>> {
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index === -1) {
      return apiClient.get(undefined, 'Event not found');
    }
    const updated = { ...mockEvents[index], ...updates } as Event;
    mockEvents[index] = updated;
    return apiClient.mutate(updated, 'Event updated');
  },

  /** Delete an event */
  deleteEvent(id: string): Promise<ApiResponse<boolean>> {
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index === -1) {
      return apiClient.get(false, 'Event not found');
    }
    mockEvents.splice(index, 1);
    return apiClient.mutate(true, 'Event deleted');
  },
};
