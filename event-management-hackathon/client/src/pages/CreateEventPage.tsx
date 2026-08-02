import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PlusCircle, ArrowLeft, Image, Calendar, MapPin, Tag, Users, DollarSign } from 'lucide-react'
import { PublicLayout } from '../components/layout/PublicLayout'
import { HomeHeader } from '../features/events/components/HomeHeader'
import { createEventApi } from '../api/eventsApi'
import { useAuth } from '../contexts/AuthContext';

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { user, token, isLoading: authLoading } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Hackathon')
  const [startAt, setStartAt] = useState('')
  const [venue, setVenue] = useState('')
  const [college, setCollege] = useState('')
  const [capacity, setCapacity] = useState(100)
  const [price, setPrice] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!user || !token) {
        navigate('/auth')
      } else if (user.role !== 'organizer' && user.role !== 'admin') {
        alert('Access denied: Only organizers can create events.')
        navigate('/')
      }
    }
  }, [user, token, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSubmitting(true)
    setError(null)

    try {
      const created = await createEventApi(
        {
          title,
          description,
          category,
          startAt: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
          venue: venue || 'Main Campus',
          college: college || user?.college || 'College',
          capacity: Number(capacity),
          price: Number(price),
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
        },
        token
      )
      navigate(`/events/${created.id || created._id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <HomeHeader />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white mb-4 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to events
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <PlusCircle className="w-8 h-8 text-purple-500" /> Host New Event
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Publish an event, hackathon, or workshop for attendee participants
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/80 font-medium mb-1 block">Event Title *</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="e.g., National College Hackathon 2026"
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-purple-500/80 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/80 font-medium mb-1 block">Category</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <Tag className="w-4 h-4 text-purple-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent text-white text-sm outline-none"
                  >
                    <option value="Hackathon" className="bg-slate-900 text-white">Hackathon</option>
                    <option value="Workshop" className="bg-slate-900 text-white">Workshop</option>
                    <option value="Music" className="bg-slate-900 text-white">Music / Fest</option>
                    <option value="Seminar" className="bg-slate-900 text-white">Seminar</option>
                    <option value="Sports" className="bg-slate-900 text-white">Sports</option>
                    <option value="General" className="bg-slate-900 text-white">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/80 font-medium mb-1 block">Date & Time *</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  <input
                    required
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    type="datetime-local"
                    className="w-full bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/80 font-medium mb-1 block">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about the schedule, tracks, prizes, and requirements..."
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-purple-500/80 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/80 font-medium mb-1 block">Venue</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    type="text"
                    placeholder="e.g., Campus Auditorium / Lab 3"
                    className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/80 font-medium mb-1 block">Hosting College</label>
                <input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  type="text"
                  placeholder="e.g., Stanford University"
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/80 font-medium mb-1 block">Total Seat Capacity</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <input
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    type="number"
                    min="1"
                    className="w-full bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/80 font-medium mb-1 block">Ticket Price ($0 for Free)</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <input
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    type="number"
                    min="0"
                    className="w-full bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/80 font-medium mb-1 block">Banner Image URL</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                <Image className="w-4 h-4 text-white/60" />
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50"
              >
                {submitting ? 'Publishing Event...' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </PublicLayout>
  )
}
