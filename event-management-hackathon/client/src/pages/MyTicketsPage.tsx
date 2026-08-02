import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket, Calendar, MapPin, QrCode, Trash2, ArrowLeft } from 'lucide-react'
import { PublicLayout } from '../components/layout/PublicLayout'
import { HomeHeader } from '../features/events/components/HomeHeader'
import { getMyTicketsApi, cancelBookingApi, Booking } from '../api/bookingsApi'
import { useAuth } from '../contexts/AuthContext';

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const { user, token, isLoading: authLoading } = useAuth()

  const [tickets, setTickets] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || !token)) {
      navigate('/auth')
      return
    }

    async function fetchTickets() {
      if (!token) return
      setLoading(true)
      try {
        const data = await getMyTicketsApi(token)
        setTickets(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch your tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [user, token, authLoading, navigate])

  const handleCancel = async (bookingId: string) => {
    if (!token || !window.confirm('Are you sure you want to cancel this registration?')) return

    setCancellingId(bookingId)
    try {
      await cancelBookingApi(bookingId, token)
      setTickets(tickets.filter((t) => t._id !== bookingId))
    } catch (err: any) {
      alert(err.message || 'Failed to cancel registration')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <PublicLayout>
      <HomeHeader />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white mb-2 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to home
            </Link>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Ticket className="w-8 h-8 text-pink-500" /> My Event Tickets
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Your active registrations and campus pass QR codes
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/60">Loading your passes...</div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <Ticket className="w-16 h-16 text-white/30 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Tickets Yet</h3>
            <p className="text-sm text-white/60">
              You haven't registered for any events yet. Explore upcoming hackathons and campus workshops!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition shadow-lg"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => {
              const event = ticket.event
              const ticketCode = ticket.qrCode || `TICK-${ticket._id.substring(0, 8).toUpperCase()}`

              return (
                <div
                  key={ticket._id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col justify-between shadow-xl hover:border-purple-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {ticket.status.toUpperCase()}
                      </span>
                      <h3 className="text-xl font-bold text-white leading-snug">
                        {event?.title || 'Campus Event'}
                      </h3>
                    </div>

                    <div className="bg-black/60 p-3 rounded-2xl border border-white/10 text-center flex-shrink-0">
                      <QrCode className="w-8 h-8 text-pink-400 mx-auto mb-1" />
                      <span className="font-mono text-[10px] text-white/70 block">
                        {ticketCode}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{event?.startAt ? new Date(event.startAt).toLocaleString() : 'TBA'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-400" />
                      <span>{event?.venue || 'Main Campus'}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Link
                      to={`/events/${event?._id || event?.id}`}
                      className="text-xs text-pink-400 hover:text-pink-300 font-semibold"
                    >
                      View Details &rarr;
                    </Link>

                    <button
                      onClick={() => handleCancel(ticket._id)}
                      disabled={cancellingId === ticket._id}
                      className="inline-flex items-center gap-1 text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {cancellingId === ticket._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </PublicLayout>
  )
}
