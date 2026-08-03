import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as api from '../services/volunteerApi';

const TaskCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low'|'Medium'|'High'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [notes, setNotes] = useState('');
  const [vols, setVols] = useState<api.Volunteer[]>([]);
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();
  const [search] = useSearchParams();

  useEffect(() => {
    api.getVolunteers().then(r => setVols(r));
    const pre = search.get('volunteerId');
    if (pre) setVolunteerId(pre);
  }, [search]);

  const validate = () => {
    if (!title.trim()) return 'Task name is required';
    if (!priority) return 'Priority required';
    return null;
  };

  const handleSave = async (assign = false) => {
    const err = validate();
    if (err) return alert(err);
    setSaving(true);
    const payload: Omit<api.Task, 'id'> = {
      title,
      description,
      volunteerId: volunteerId || null,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      event: eventName,
      status: assign ? 'In Progress' : 'Pending',
      notes
    } as Omit<api.Task, 'id'>;

    await api.createTask(payload);
    setSaving(false);
    nav('/tasks');
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-2">Create Task</h2>
        <p className="text-sm text-slate-500 mb-4">Assign tasks to volunteers with priority and deadlines</p>

        <div className="space-y-3">
          <div>
            <label className="text-sm">Task Name</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Assign Volunteer</label>
              <select value={volunteerId ?? ''} onChange={(e) => setVolunteerId(e.target.value || null)} className="w-full border rounded px-3 py-2 mt-1">
                <option value="">Unassigned</option>
                {vols.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full border rounded px-3 py-2 mt-1">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm">Event</label>
            <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </div>

          <div className="flex gap-2 mt-4">
            <button disabled={saving} onClick={() => handleSave(false)} className="bg-slate-100 px-4 py-2 rounded">Save Draft</button>
            <button disabled={saving} onClick={() => handleSave(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Assign Task</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCreate;
