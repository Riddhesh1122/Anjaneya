import { apiGet } from './http'
import { FALLBACK_EVENTS } from '../features/events/data'
import type { EventItem } from '../types/event'

function mapBackendEvent(event: any): EventItem {
  const dateStr = event.startAt
    ? new Date(event.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : event.date || 'TBA'

  return {
    ...event,
    id: String(event._id || event.id || crypto.randomUUID()),
    _id: String(event._id || event.id || ''),
    title: event.title,
    description: event.description || '',
    date: dateStr,
    venue: event.venue || 'Main Campus Auditorium',
    image: event.imageUrl || event.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
    imageUrl: event.imageUrl || event.image,
    tag: event.category || event.tag || 'Event',
    category: event.category || 'General',
    price: event.price ?? 0,
    capacity: event.capacity ?? 100,
    registeredCount: event.registeredCount ?? 0,
  }
}

export async function getFeaturedEvents(query?: string): Promise<EventItem[]> {
  try {
    const endpoint = query ? `/events?${query}` : '/events'
    const events = await apiGet<any[]>(endpoint)

    if (!Array.isArray(events) || events.length === 0) {
      return FALLBACK_EVENTS
    }

    return events.map(mapBackendEvent)
  } catch {
    return FALLBACK_EVENTS
  }
}

export async function getEventById(id: string): Promise<EventItem> {
  try {
    const event = await apiGet<any>(`/events/${id}`)
    return mapBackendEvent(event)
  } catch (err) {
    const fallback = FALLBACK_EVENTS.find((e) => e.id === id) || FALLBACK_EVENTS[0]
    return { ...fallback, description: 'Join us for this exciting campus event! Full schedule and guidelines will be shared upon registration.' }
  }
}

export async function createEventApi(eventData: any, token: string): Promise<EventItem> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create event')
  }

  return mapBackendEvent(data)
}
