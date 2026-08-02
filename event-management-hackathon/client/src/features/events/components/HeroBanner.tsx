import { Link } from 'react-router-dom'
import type { EventItem } from '../../../types/event'

type HeroBannerProps = {
  event: EventItem
}

export function HeroBanner({ event }: HeroBannerProps) {
  const eventId = event.id || event._id

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="relative">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-900 to-pink-950/30 p-1 border border-white/10 shadow-2xl">
          <div className="rounded-[22px] bg-black/80 backdrop-blur-md p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 mb-3">
                🔥 Hot Event
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                Featured: {event.title}
              </h2>
              <p className="mt-3 text-sm text-white/70 max-w-xl">
                {event.description || 'Join top attendees for hands-on experience, networking, and prizes.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/events/${eventId}`}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                  Explore & Register
                </Link>
              </div>
            </div>

            <div className="w-full md:w-80 flex-shrink-0">
              <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl">
                <img src={event.image} alt={event.title} className="w-full h-48 md:h-56 object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-6 left-6 w-40 h-20 rounded-full blur-3xl opacity-30 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mix-blend-screen" />
      </div>
    </section>
  )
}
