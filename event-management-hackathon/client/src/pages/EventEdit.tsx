import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import { eventApi } from '../services/eventApi';

const EventEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    if (id) {
      eventApi.getEventById(id).then((d) => { if (mounted) setInitial(d); });
    }
    return () => { mounted = false; };
  }, [id]);

  const onSave = async (data: any, publish?: boolean) => {
    if (!id) return;
    try {
      const updated = await eventApi.updateEvent(id, data);
      navigate(`/events/${id}`);
    } catch (err) { console.error(err); alert('Failed to update'); }
  };

  if (!initial) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Edit Event</h1>
        <p className="mt-1 text-sm text-slate-600">Update event details</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow">
        <EventForm initial={initial} onSave={onSave} />
      </div>
    </div>
  );
};

export default EventEdit;
