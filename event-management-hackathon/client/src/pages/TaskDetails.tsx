import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/volunteerApi';
import { motion } from 'framer-motion';

const TaskDetails: React.FC = () => {
  const { id } = useParams();
  const [task, setTask] = useState<api.Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getTasks().then((ts) => {
      const t = ts.find(x => x.id === id) || null;
      setTask(t);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!task) return <div className="p-6">Task not found</div>;

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow p-6 max-w-3xl">
        <div className="flex items-start gap-4">
          <div>
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="text-sm text-slate-500">{task.event} • {task.priority}</p>
          </div>
          <div className="ml-auto text-sm text-slate-600">Status: <span className="font-medium">{task.status}</span></div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Description</h4>
          <p className="text-sm text-slate-700 mt-1">{task.description || '—'}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded">
            <h5 className="font-semibold">Assigned Volunteer</h5>
            <div className="text-sm text-slate-700">{task.volunteerId || 'Unassigned'}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded">
            <h5 className="font-semibold">Timeline</h5>
            <div className="text-sm text-slate-700">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : '—'}</div>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="font-semibold">Checklist</h5>
          <div className="text-sm text-slate-600">Placeholder checklist (todo items)</div>
        </div>

        <div className="mt-4">
          <h5 className="font-semibold">Comments</h5>
          <div className="text-sm text-slate-600">Comments area placeholder</div>
        </div>

        <div className="mt-4">
          <h5 className="font-semibold">Attachments</h5>
          <div className="text-sm text-slate-600">Attachments placeholder</div>
        </div>

        <div className="mt-4">
          <h5 className="font-semibold">Progress</h5>
          <div className="w-full bg-slate-100 rounded-full h-3 mt-2">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;
