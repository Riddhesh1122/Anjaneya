import React from 'react';
import { Search } from 'lucide-react';

type Props = {
  q: string;
  setQ: (v: string) => void;
  skill: string;
  setSkill: (v: string) => void;
  availability: string;
  setAvailability: (v: string) => void;
};

const VolunteerFilters: React.FC<Props> = ({ q, setQ, skill, setSkill, availability, setAvailability }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="relative rounded-md border border-slate-200 px-3 py-2 shadow-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search volunteers by name, skill" className="w-full pl-10 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select value={skill} onChange={(e) => setSkill(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">Any skill</option>
          <option value="Logistics">Logistics</option>
          <option value="First Aid">First Aid</option>
          <option value="Marketing">Marketing</option>
          <option value="Photography">Photography</option>
        </select>

        <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">Any availability</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
        </select>

        <button className="ml-2 rounded-md bg-green-600 px-3 py-2 text-white text-sm">Add Volunteer</button>
      </div>
    </div>
  );
};

export default VolunteerFilters;
