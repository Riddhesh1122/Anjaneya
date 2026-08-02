import { Link } from 'react-router-dom'
import type { EventItem } from '../../../types/event'

type EventCardProps = {
  item: EventItem
}

export function EventCard({ item }: EventCardProps) {
  const eventId = item.id || item._id

  return (
    <Link to={`/events/${eventId}`} className="w-44 md:w-52 flex-shrink-0 block group">
      <div className="rounded-xl overflow-hidden shadow-lg bg-black/60 border border-white/10 group-hover:border-purple-500/50 group-hover:scale-[1.02] transition duration-200">
        <div className="relative">
          <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
          <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md">
            {item.tag || item.category}
          </span>
        </div>

        <div className="p-3">
          <h3 className="text-sm md:text-base font-semibold text-white truncate group-hover:text-pink-300 transition">{item.title}</h3>
          <p className="text-xs text-white/70 mt-1">{item.date}</p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-sm">
              View & Book
            </span>

            <span className="text-[11px] text-white/70 px-2 py-1 rounded-md bg-white/5 truncate max-w-[90px]">
              {item.venue ?? 'Campus'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
