import { motion } from 'framer-motion'
import type { EventItem } from '../../../types/event'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { EventCard } from './EventCard'

type EventFeedProps = {
  title: string
  events: EventItem[]
}

export function EventFeed({ title, events }: EventFeedProps) {
  return (
    <section className="mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title={title} />

        <motion.div drag="x" dragConstraints={{ left: -1200, right: 0 }} className="mt-4 flex gap-4 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-4 pl-1">
            {events.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
