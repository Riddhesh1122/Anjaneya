// src/services/registration.service.ts
import { apiClient, ApiResponse } from './apiClient';
import { Registration } from '../types/Registration';
import { registrations as mockRegistrations } from '../mocks/registrations';
import { Event } from '../types/Event';
import { events as mockEvents } from '../mocks/events';

/**
 * Mock service for handling registrations.
 */
export const registrationService = {
  /** Get all registrations */
  getRegistrations(): Promise<ApiResponse<Registration[]>> {
    return apiClient.get(mockRegistrations, 'Registrations fetched');
  },

  /** Get registrations for a specific event */
  getByEvent(eventId: string): Promise<ApiResponse<Registration[]>> {
    const regs = mockRegistrations.filter((r) => r.eventId === eventId);
    return apiClient.get(regs, 'Event registrations fetched');
  },

  /** Get registrations for a specific user */
  getByUser(userId: string): Promise<ApiResponse<Registration[]>> {
    const regs = mockRegistrations.filter((r) => r.userId === userId);
    return apiClient.get(regs, 'User registrations fetched');
  },

  /** Register a user for an event */
  register(userId: string, eventId: string): Promise<ApiResponse<Registration>> {
    const newReg: Registration = {
      id: `r${mockRegistrations.length + 1}`,
      createdAt: new Date().toISOString(),
      userId,
      eventId,
      registeredAt: new Date().toISOString(),
      status: 'registered',
    };
    (mockRegistrations as Registration[]).push(newReg);
    // Increment registeredCount on the event
    const ev = mockEvents.find((e) => e.id === eventId) as Event | undefined;
    if (ev) {
      ev.registeredCount += 1;
    }
    return apiClient.mutate(newReg, 'Registration successful');
  },
};
