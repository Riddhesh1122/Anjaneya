import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EventData } from '../../services/eventApi';

interface Props {
  initial?: Partial<EventData>;
  onSave: (data: Partial<EventData>, publish?: boolean) => void;
}

const EventForm: React.FC<Props> = ({ initial, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<EventData>>({ defaultValues: initial || {} });

  useEffect(() => {
    if (initial) reset(initial);
  }, [initial, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit((d) => onSave(d, false))}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Event Title</label>
        <input {...register('title', { required: 'Title required' })} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea {...register('description', { required: 'Description required' })} rows={4} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <input {...register('category', { required: 'Category required' })} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Banner URL</label>
          <input {...register('banner')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Venue</label>
          <input {...register('venue', { required: 'Venue required' })} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Location</label>
          <input {...register('location')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Date</label>
          <input type="date" {...register('date', { required: 'Date required' })} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Time</label>
          <input type="time" {...register('time')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Capacity</label>
          <input type="number" {...register('capacity', { valueAsNumber: true, required: 'Capacity required' })} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Registration Deadline</label>
          <input type="date" {...register('registrationDeadline')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tags (comma separated)</label>
          <input {...register('tags')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Organizer</label>
          <input {...register('organizer', { required: 'Organizer required' })} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Contact Email</label>
          <input type="email" {...register('contactEmail')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Contact Phone</label>
          <input {...register('contactPhone')} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div className="flex items-end justify-end gap-2">
          <button type="button" onClick={handleSubmit((d) => onSave(d, false))} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Save Draft</button>
          <button type="button" onClick={handleSubmit((d) => onSave(d, true))} className="rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm text-white">Publish Event</button>
        </div>
      </div>
    </form>
  );
};

export default EventForm;