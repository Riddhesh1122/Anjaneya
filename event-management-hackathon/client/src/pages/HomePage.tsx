import React from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, User } from 'lucide-react'

type EventItem = {
  id: string
  title: string
  date: string
  image: string
  venue?: string
  tag?: string
}

const DUMMY_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Intercollege Hackathon 2026',
    date: 'Aug 20 • 09:00 AM',
    venue: 'PDPU Auditorium',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a7f5f3586b9ae5588e0fef6e6d04a0b',
    tag: 'Hackathon',
  },
  {
    id: 'e2',
    title: 'Open Mic Night — College Fest',
    date: 'Aug 25 • 07:00 PM',
    venue: 'Main Lawn',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c6f0d5406e3f8a7a1b0b8f3f5fb1e6b',
    tag: 'Music',
  },
  {
    id: 'e3',
    title: 'AI Workshop — Beginners',
    date: 'Sep 01 • 10:00 AM',
    venue: 'Lab 4',
    image:
      'https://images.unsplash.com/photo-1554168146-1105c6a39f93?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a1b9d6c6b8c5f1c0f5f840b7ad1d3d6',
    tag: 'Workshop',
  },
  {
    id: 'e4',
    title: 'Retro Movie Night',
    date: 'Sep 05 • 08:00 PM',
    venue: 'Auditorium',
    image:
      'https://images.unsplash.com/photo-1542204637-6a9b7c1b4d6f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=b4bd25d2b9bdb59a49d7a2c4b8e3b2a2',
    tag: 'Cinema',
  },
  {
    id: 'e5',
    title: 'Design Sprint — UI/UX',
    date: 'Sep 10 • 11:00 AM',
    venue: 'Studio 2',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a9b3a8f9b2d1efb0703f2d8b2f8c1e7',
    tag: 'Design',
  },
]

function NavBar({ onSignIn }: { onSignIn?: () => void }) {
  return (
    <header className="w-full bg-transparent py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonPurple via-neonPink to-neonBlue">
            EventHub
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 bg-white/3 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-white/5">
              <Search className="w-5 h-5 text-white/80" />
              <input
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/60"
                placeholder="Search events, workshops, clubs..."
                aria-label="Search events"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-white/90 bg-white/3 backdrop-blur rounded-full px-3 py-2 border border-white/5">
            <MapPin className="w-4 h-4 text-white/80" />
            <span className="text-xs">Pune</span>
          </button>

          <a href="/auth" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-neonPurple to-neonPink text-white shadow-[0_8px_30px_rgba(139,92,246,0.25)] hover:scale-105 transition">
            <User className="w-4 h-4" />
            Sign In
          </a>
        </div>
      </div>
    </header>
  )
}

function HeroCarousel() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="relative">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f172a] via-[#0b1220] to-[#07060a] p-1 shadow-[0_20px_60px_rgba(99,102,241,0.12)]">
          <div className="rounded-3xl bg-black p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Featured: Intercollege Hackathon
              </h2>
              <p className="mt-3 text-sm text-white/70 max-w-xl">
                Join top student teams across Pune for 24 hours of coding, design,
                and innovation. Prizes, mentorship, and placement opportunities.
              </p>

              <div className="mt-6 flex gap-3">
                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-neonPurple to-neonPink text-white font-semibold shadow-[0_10px_40px_rgba(139,92,246,0.18)] hover:scale-105 transition">
                  Explore
                </button>
                <button className="px-5 py-3 rounded-xl border border-white/10 text-white/90 bg-white/3 backdrop-blur hover:bg-white/5 transition">
                  Learn More
                </button>
              </div>
            </div>

            <div className="w-full md:w-72">
              <div className="rounded-xl overflow-hidden shadow-[0_18px_50px_rgba(139,92,246,0.14)]">
                <img
                  src={DUMMY_EVENTS[0].image}
                  alt="featured"
                  className="w-full h-48 md:h-60 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-6 left-6 w-40 h-20 rounded-full blur-3xl opacity-30 bg-gradient-to-r from-neonPurple via-neonPink to-neonBlue mix-blend-screen" />
      </div>
    </section>
  )
}

function EventCard({ item }: { item: EventItem }) {
  return (
    <div className="w-44 md:w-52 flex-shrink-0">
      <div className="rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] bg-black/60 border border-white/5">
        <div className="relative">
          <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
          <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold text-black bg-gradient-to-r from-neonPurple to-neonPink">
            {item.tag}
          </span>
        </div>

        <div className="p-3">
          <h3 className="text-sm md:text-base font-semibold text-white truncate">{item.title}</h3>
          <p className="text-xs text-white/70 mt-1">{item.date}</p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#e11d74] text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)]">
              Book
            </button>

            <button className="text-xs text-white/70 px-2 py-1 rounded-md bg-white/3">{item.venue ?? 'Venue'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HorizontalFeed({ title, items }: { title: string; items: EventItem[] }) {
  return (
    <section className="mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <a className="text-sm text-white/60">See all</a>
        </div>

        <motion.div drag="x" dragConstraints={{ left: -1200, right: 0 }} className="mt-4 flex gap-4 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-4 pl-1">
            {items.map((it) => (
              <EventCard key={it.id} item={it} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const recommended = DUMMY_EVENTS.slice(0, 4)
  const trending = DUMMY_EVENTS.slice(1)

  return (
    <div className="min-h-screen bg-black text-white antialiased relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-950 to-black" />

      <NavBar />

      <main className="pt-6 pb-16">
        <HeroCarousel />

        <div className="max-w-7xl mx-auto px-4 mt-6">
          <HorizontalFeed title="Recommended For You" items={recommended} />
          <HorizontalFeed title="Trending Near You" items={trending} />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 text-xs text-white/50">© 2026 EventHub — Built for Hackathon</footer>
    </div>
  )
}
