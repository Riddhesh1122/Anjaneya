import { useState, useEffect } from 'react'
import { FALLBACK_EVENTS } from '../features/events/data'
import { getFeaturedEvents } from '../api/eventsApi'
import type { EventItem } from '../types/event'

export function useFeaturedEvents() {
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getFeaturedEvents()
        if (data && data.length > 0) {
          setEvents(data)
        }
      } catch (err) {
        console.error('Error loading events:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return {
    events,
    loading,
    featuredEvent: events[0] ?? FALLBACK_EVENTS[0],
    recommendedEvents: events.slice(0, 4),
    trendingEvents: events.slice(1),
  }
}
