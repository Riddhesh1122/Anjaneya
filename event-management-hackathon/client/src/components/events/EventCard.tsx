import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { EventData } from '../../services/eventApi';
import { Link } from 'react-router-dom';

const badgeFor = (ev: EventData) => {
  const now = new Date();
  const date = new Date(ev.date);
  if (date > now) return { text: 'Open', color: 'bg-green-50 text-green-700' };
  return { text: 'Closed', color: 'bg-rose-50 text-rose-700' };
};

const EventCard: React.FC<{ ev: EventData }> = ({ ev }) => {
  const badge = badgeFor(ev);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="rounded-2xl bg-white shadow p-4 flex flex-col"
    >
      <div className="h-40 w-full rounded-md bg-slate-100" style={{ backgroundImage: ev.banner ? `url(${ev.banner})` : undefined }} />

      <div className="mt-3 flex-1">
        <h3 className="text-lg font-semibold">{ev.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{ev.shortDescription}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700">{ev.category}</span>
          <span className="inline-flex items-center gap-1 text-slate-500"><Calendar className="h-4 w-4" />{new Date(ev.date).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1 text-slate-500"><Clock className="h-4 w-4" />{ev.time}</span>
          <span className="inline-flex items-center gap-1 text-slate-500"><MapPin className="h-4 w-4" />{ev.venue}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">Seats: {ev.capacity - ev.registered} left</div>
          <div className="text-sm font-medium rounded-full px-3 py-1" title={badge.text}>
            <span className={`${badge.color} rounded-full px-2 py-1 text-xs font-medium`}>{badge.text}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button className="flex-1 rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-white text-sm">Register</button>
        <Link to={`/events/${ev.id}`} className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">View Details</Link>
      </div>
    </motion.article>
  );
};

export default EventCard;
