import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Tag, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { PublicLayout } from '../components/layout/PublicLayout'
import { HomeHeader } from '../features/events/components/HomeHeader'
import { getEventById } from '../api/eventsApi'
import { bookEventApi } from '../api/bookingsApi'
import { useAuth } from '../contexts/AuthContext';
import type { EventItem } from '../types/event'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [bookingResult, setBookingResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return
      setLoading(true)
      try {
        const data = await getEventById(id)
        setEvent(data)
      } catch (err: any) {
        setError('Failed to load event details')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const handleRegister = async () => {
    if (!user || !token) {
      navigate('/auth')
      return
    }

    if (!id && !event?._id) return

    setRegistering(true)
    setError(null)

    try {
      const targetId = event?._id || id || ''
      const res = await bookEventApi(targetId, token)
      setBookingResult(res)
      if (event) {
        setEvent({
          ...event,
          registeredCount: (event.registeredCount ?? 0) + 1,
        })
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. You may already be registered.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <HomeHeader />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-white/70">
          Loading event details...
        </div>
      </PublicLayout>
    )
  }

  if (!event) {
    return (
      <PublicLayout>
        <HomeHeader />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl text-white font-bold mb-4">Event Not Found</h2>
          <Link to="/" className="text-pink-400 hover:underline">Back to Events</Link>
        </div>
      </PublicLayout>
    )
  }

  const capacity = event.capacity || 100
  const registered = event.registeredCount || 0
  const seatsLeft = Math.max(0, capacity - registered)
  const percentFull = Math.min(100, Math.round((registered / capacity) * 100))

  return (
    <PublicLayout>
      <HomeHeader />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>

        {bookingResult ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-3xl font-extrabold text-white">Registration Confirmed!</h2>
            <p className="text-emerald-200/80">You are successfully registered for <strong>{event.title}</strong>.</p>
            <div className="bg-black/60 p-4 rounded-2xl border border-emerald-500/20 max-w-sm mx-auto">
              <span className="text-xs text-white/60 block">Ticket Pass ID</span>
              <span className="font-mono text-xl text-pink-400 tracking-wider font-bold">
                {bookingResult.qrCode || `TICK-${bookingResult._id?.substring(0, 8).toUpperCase()}`}
              </span>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                to="/tickets"
                className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold transition"
              >
                View My Tickets
              </Link>
              <button
                onClick={() => setBookingResult(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
              >
                Event Details
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                <img src={event.image || event.imageUrl} alt={event.title} className="w-full h-80 md:h-96 object-cover" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-pink-600 text-white shadow-lg">
                  {event.tag || event.category}
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">{event.title}</h1>
                <p className="text-white/70 mt-4 leading-relaxed whitespace-pre-line text-base">
                  {event.description || 'Join us for this exciting campus event! Connect with peers, learn new skills, and showcase your talent.'}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-pink-400" /> Event Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-white/50 block">Date & Time</span>
                      <span className="font-medium">{event.date || 'To be announced'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-white/50 block">Venue</span>
                      <span className="font-medium">{event.venue || 'Main Auditorium'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white/80">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-white/50 block">Capacity</span>
                      <span className="font-medium">{capacity} Seats Total ({seatsLeft} remaining)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white/80">
                    <Tag className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-white/50 block">Entry Fee</span>
                      <span className="font-medium">{event.price ? `$${event.price}` : 'Free Entry'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 sticky top-6 space-y-6 shadow-xl">
                <div>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-semibold block">Ticket Status</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {event.price ? `$${event.price}` : 'FREE'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Occupancy</span>
                    <span>{percentFull}% Full</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${percentFull}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-white/50 text-right">{seatsLeft} spots left</p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={registering || seatsLeft <= 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                >
                  {registering ? 'Processing...' : seatsLeft <= 0 ? 'Sold Out' : user ? 'Register Now' : 'Sign In to Register'}
                </button>

                <p className="text-[11px] text-white/40 text-center">
                  Instant ticket pass generation upon confirmation.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  )
}
