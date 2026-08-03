import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/volunteerApi';
import { motion } from 'framer-motion';

const VolunteerProfile: React.FC = () => {
  const { id } = useParams();
  const [v, setV] = useState<api.Volunteer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getVolunteer(id).then((r) => {
      setV(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!v) return <div className="p-6">Volunteer not found</div>;

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex items-center gap-6">
          <img src={v.avatar || 'https://i.pravatar.cc/150?img=3'} alt={v.name} className="h-28 w-28 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{v.name}</h2>
            <p className="text-sm text-slate-500">{v.role}</p>
            <p className="mt-2 text-sm">{v.email} • {v.phone}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-slate-600 font-medium">{v.completionPercent}%</div>
            <div className="text-xs text-slate-400">Tasks completed</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-slate-700">{v.experience}</p>

            <h3 className="font-semibold mt-4 mb-2">Skills</h3>
            <div className="flex gap-2 flex-wrap">
              {v.skills.map(s => <span key={s} className="bg-slate-100 px-2 py-1 text-xs rounded">{s}</span>)}
            </div>

            <h3 className="font-semibold mt-4 mb-2">Certificates</h3>
            <ul className="text-sm text-slate-600">
              {v.certificates?.length ? v.certificates.map(c => <li key={c}>{c}</li>) : <li>—</li>}
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Current Tasks</h3>
            <div className="text-sm text-slate-600">Coming soon — shows assigned tasks and progress.</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="h-40 bg-slate-50 rounded flex items-center justify-center text-sm text-slate-400">Calendar placeholder</div>

            <h3 className="font-semibold mt-4 mb-2">Completed Events</h3>
            <div className="text-sm text-slate-600">List of events this volunteer completed (placeholder)</div>

            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md">Message Volunteer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
