export interface Booking {
  _id: string
  user: any
  event: any
  status: string
  qrCode?: string
  createdAt: string
}

export async function bookEventApi(eventId: string, token: string): Promise<Booking> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to register for event')
  }

  return data
}

export async function getMyTicketsApi(token: string): Promise<Booking[]> {
  const res = await fetch('/api/bookings/my-tickets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch tickets')
  }

  return data
}

export async function cancelBookingApi(bookingId: string, token: string): Promise<void> {
  const res = await fetch(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to cancel registration')
  }
}
