import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import { eventApi } from '../services/eventApi';

const EventsCreate: React.FC = () => {
  const navigate = useNavigate();

  const onSave = async (data: any, publish?: boolean) => {
    try {
      const payload = { ...data };
      const created = await eventApi.createEvent(payload);
      if (publish) {
        navigate(`/events/${created.id}`);
      } else {
        navigate('/events');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Create Event</h1>
        <p className="mt-1 text-sm text-slate-600">Add details and publish your event.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <EventForm onSave={onSave} />
      </div>
    </div>
  );
};

export default EventsCreate;
