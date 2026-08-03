import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

interface Props {
  q: string;
  setQ: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}

const EventFilters: React.FC<Props> = ({ q, setQ, category, setCategory, date, setDate, location, setLocation, sort, setSort }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="relative rounded-md border border-slate-200 px-3 py-2 shadow-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, organizers, location" className="w-full pl-10 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">All categories</option>
          <option value="Meetup">Meetup</option>
          <option value="Training">Training</option>
          <option value="Concert">Concert</option>
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm" />

        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-md border border-slate-200 px-3 py-2 text-sm" />

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most registered</option>
        </select>

        <button className="ml-2 hidden rounded-md bg-blue-600 px-3 py-2 text-white text-sm md:inline-flex">Filter</button>
      </div>
    </div>
  );
};

export default EventFilters;


