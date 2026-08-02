import { BaseEntity } from './Common';
import { Role } from './Role';

export type EventItem = {
  _id?: string
  id: string
  title: string
  description?: string
  date?: string
  startAt?: string
  endAt?: string
  venue?: string
  college?: string
  capacity?: number
  registeredCount?: number
  price?: number
  category?: string
  image?: string
  imageUrl?: string
  tag?: string
  tags?: string[]
  organizer?: {
    _id: string
    name: string
    email: string
    college?: string
  }
}

export type EventStatus = 'draft' | 'published' | 'cancelled';

export interface Event extends BaseEntity {
  title: string;
  description: string;
  category: string;
  bannerImage: string;
  organizerId: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
}
