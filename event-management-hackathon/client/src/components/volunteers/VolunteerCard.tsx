import React from 'react';
import { Volunteer } from '../../services/volunteerApi';
import { MessageCircle, UserPlus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type Props = {
  v: Volunteer;
};

const VolunteerCard: React.FC<Props> = ({ v }) => {
  const nav = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-start"
    >
      <img src={v.avatar || 'https://i.pravatar.cc/150?img=3'} alt={v.name} className="h-16 w-16 rounded-full object-cover" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{v.name}</h3>
            <p className="text-xs text-slate-500">{v.role}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-700 font-medium">{v.completionPercent}%</div>
            <div className="text-xs text-slate-400">Tasks done</div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {v.skills.map((s) => (
            <span key={s} className="text-xs bg-slate-100 px-2 py-1 rounded-full">{s}</span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <div>Availability: <span className="font-medium">{v.availability}</span></div>
            <div className="text-xs text-slate-400">Assigned: {v.assignedEvent || '—'}</div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => nav(`/tasks/create?volunteerId=${v.id}`)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:opacity-90 transition">
              <UserPlus className="h-4 w-4" /> Assign Task
            </button>

            <button onClick={() => nav(`/volunteers/${v.id}`)} className="p-2 rounded-md bg-slate-50 hover:bg-slate-100">
              <Eye className="h-4 w-4 text-slate-700" />
            </button>

            <button className="p-2 rounded-md bg-slate-50 hover:bg-slate-100">
              <MessageCircle className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VolunteerCard;
