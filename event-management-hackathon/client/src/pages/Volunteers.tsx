import React, { useEffect, useState } from 'react';
import VolunteerFilters from '../components/volunteers/VolunteerFilters';
import VolunteerCard from '../components/volunteers/VolunteerCard';
import * as api from '../services/volunteerApi';
import { motion } from 'framer-motion';

const VolunteersPage: React.FC = () => {
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState('');
  const [availability, setAvailability] = useState('');
  const [list, setList] = useState<api.Volunteer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getVolunteers().then((r) => {
      setList(r);
      setLoading(false);
    });
  }, []);

  const filtered = list.filter((v) => {
    if (q && !v.name.toLowerCase().includes(q.toLowerCase()) && !v.skills.join(' ').toLowerCase().includes(q.toLowerCase())) return false;
    if (skill && !v.skills.includes(skill)) return false;
    if (availability && v.availability !== availability) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Volunteers</h1>
        <p className="text-sm text-slate-500">Manage volunteers, assignments and availability</p>
      </div>

      <div className="mb-6">
        <VolunteerFilters q={q} setQ={setQ} skill={skill} setSkill={setSkill} availability={availability} setAvailability={setAvailability} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <VolunteerCard key={v.id} v={v} />
          ))}
        </motion.div>
      )}

      {(!loading && filtered.length === 0) && (
        <div className="mt-10 text-center text-slate-500">
          No volunteers found. <button className="text-blue-600">Add your first volunteer</button>
        </div>
      )}
    </div>
  );
};

export default VolunteersPage;
