import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventApi, EventData } from '../services/eventApi';
import ConfirmModal from '../components/events/ConfirmModal';
import { motion } from 'framer-motion';

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (id) {
      eventApi.getEventById(id).then((d) => {
        if (mounted) {
          setEvent(d);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  const onDelete = async () => {
    if (!id) return;
    await eventApi.deleteEvent(id);
    setConfirmOpen(false);
    navigate('/events');
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!event) return <div className="p-6">Event not found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="h-56 w-full rounded-md bg-slate-100" />
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{event.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{event.shortDescription}</p>
            <p className="mt-2 text-sm text-slate-500">Organized by {event.organizer}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to={`/events/edit/${event.id}`} className="rounded-md border border-slate-200 px-3 py-2 text-sm">Edit</Link>
            <button onClick={() => setConfirmOpen(true)} className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white">Delete</button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-sm text-slate-600">{event.description}</p>

            <h3 className="mt-4 text-lg font-semibold">Schedule</h3>
            <p className="text-sm text-slate-600">{new Date(event.date).toLocaleString()} {event.time}</p>

            <h3 className="mt-4 text-lg font-semibold">Rules</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
              {event.rules?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <h3 className="mt-4 text-lg font-semibold">Venue</h3>
            <p className="text-sm text-slate-600">{event.venue}</p>

            <div className="mt-6">
              <button className="rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-white">Register</button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-md border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Capacity</p>
              <p className="mt-1 text-lg font-semibold">{event.registered} / {event.capacity}</p>
            </div>

            <div className="rounded-md border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Registration Deadline</p>
              <p className="mt-1 text-sm">{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : '—'}</p>
            </div>

            <div className="rounded-md border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Contact</p>
              <p className="mt-1 text-sm">{event.contactEmail}</p>
              <p className="mt-1 text-sm">{event.contactPhone}</p>
            </div>

            <div className="rounded-md border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Map</p>
              <div className="mt-2 h-36 w-full rounded-md bg-slate-100 text-center">Google Maps placeholder</div>
            </div>
          </aside>
        </div>
      </div>

      <ConfirmModal open={confirmOpen} title="Delete event" message="Are you sure you want to delete this event?" onConfirm={onDelete} onCancel={() => setConfirmOpen(false)} />
    </motion.div>
  );
};

export default EventDetails;
