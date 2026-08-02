// src/types/Registration.ts
import { BaseEntity } from './Common';

export type RegistrationStatus = 'registered' | 'cancelled' | 'waitlist';

export interface Registration extends BaseEntity {
  userId: string; // reference to User.id
  eventId: string; // reference to Event.id
  registeredAt: string; // ISO timestamp
  status: RegistrationStatus;
}
