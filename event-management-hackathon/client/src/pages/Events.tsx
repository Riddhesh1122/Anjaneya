import React, { useEffect, useMemo, useState } from 'react';
import EventFilters from '../components/events/EventFilters';
import EventCard from '../components/events/EventCard';
import { eventApi, EventData } from '../services/eventApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[] | null>(null);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    let mounted = true;
    eventApi.getEvents().then((data) => {
      if (mounted) setEvents(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!events) return [];
    return events
      .filter((e) => {
        const qLower = q.toLowerCase();
        if (q && !(e.title.toLowerCase().includes(qLower) || e.organizer.toLowerCase().includes(qLower) || e.category.toLowerCase().includes(qLower) || (e.location || '').toLowerCase().includes(qLower))) return false;
        if (category && e.category !== category) return false;
        if (date && e.date.split('T')[0] !== date) return false;
        if (location && !(e.location || '').toLowerCase().includes(location.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sort === 'popular') return b.registered - a.registered;
        return 0;
      });
  }, [events, q, category, date, location, sort]);

  if (events === null) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-1/3 rounded bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-48 rounded bg-slate-200" />
            <div className="h-48 rounded bg-slate-200" />
            <div className="h-48 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="mt-1 text-sm text-slate-600">Browse and manage all events</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/events/create" className="rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-white text-sm">Create Event</Link>
        </div>
      </div>

      <EventFilters q={q} setQ={setQ} category={category} setCategory={setCategory} date={date} setDate={setDate} location={location} setLocation={setLocation} sort={sort} setSort={setSort} />

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <div className="h-40 w-full rounded-md bg-slate-100" />
            <h2 className="mt-4 text-xl font-semibold">No Events Found</h2>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or create your first event.</p>
            <div className="mt-4">
              <Link to="/events/create" className="rounded-md bg-blue-600 px-4 py-2 text-white">Create Your First Event</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {filtered.map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventsPage;
