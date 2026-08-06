import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowUpDown, Download, FileText, ChevronLeft, ChevronRight,
  UserCheck, Calendar, Ticket, CheckCircle2, Clock, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { exportToCSV, exportToPDF } from '../../utils/exportReports';

interface RegistrationRow {
  id: string;
  student: string;
  email: string;
  event: string;
  regDate: string;
  status: 'Registered' | 'Approved' | 'Pending';
  attendance: 'Checked In' | 'Pending';
}

interface EventRow {
  id: string;
  title: string;
  organizer: string;
  date: string;
  capacity: number;
  registrations: number;
  status: 'Active' | 'Upcoming' | 'Completed';
}

interface VolunteerRow {
  id: string;
  name: string;
  event: string;
  role: string;
  status: 'Assigned' | 'Completed' | 'In Progress';
}

const mockRegistrations: RegistrationRow[] = [
  { id: 'r1', student: 'Aarav Sharma', email: 'aarav@example.com', event: 'AI & ML Innovations Summit', regDate: 'Today, 10:14 AM', status: 'Approved', attendance: 'Checked In' },
  { id: 'r2', student: 'Priya Patel', email: 'priya@example.com', event: 'Global Hackathon 2026', regDate: 'Today, 11:30 AM', status: 'Registered', attendance: 'Pending' },
  { id: 'r3', student: 'Rohan Verma', email: 'rohan@example.com', event: 'Cyber Security Workshop', regDate: 'Yesterday', status: 'Approved', attendance: 'Checked In' },
  { id: 'r4', student: 'Ananya Gupta', email: 'ananya@example.com', event: 'AI Innovations Summit', regDate: 'Aug 4', status: 'Approved', attendance: 'Checked In' },
  { id: 'r5', student: 'Vikram Singh', email: 'vikram@example.com', event: 'Web3 & Cloud Summit', regDate: 'Aug 3', status: 'Pending', attendance: 'Pending' },
];

const mockEvents: EventRow[] = [
  { id: 'e1', title: 'AI & ML Innovations Summit 2026', organizer: 'Tech Foundation', date: 'Today, Aug 4', capacity: 500, registrations: 420, status: 'Active' },
  { id: 'e2', title: 'Global Hackathon & Code Sprint', organizer: 'Dev Community', date: 'Aug 6 - Aug 8', capacity: 350, registrations: 280, status: 'Upcoming' },
  { id: 'e3', title: 'Cyber Security & Zero Trust Workshop', organizer: 'Cyber Shield', date: 'Aug 14', capacity: 150, registrations: 115, status: 'Upcoming' },
  { id: 'e4', title: 'NextGen React & TypeScript Masterclass', organizer: 'Frontend Guild', date: 'Jul 28', capacity: 200, registrations: 200, status: 'Completed' },
];

const mockVolunteers: VolunteerRow[] = [
  { id: 'v1', name: 'Kabir Mehta', event: 'AI & ML Innovations Summit', role: 'Registration Desk & QR Scanner', status: 'In Progress' },
  { id: 'v2', name: 'Sneha Reddy', event: 'Global Hackathon 2026', role: 'Technical Support & Mentor', status: 'Assigned' },
  { id: 'v3', name: 'Rahul Joshi', event: 'Cyber Security Workshop', role: 'Venue Coordinator', status: 'Assigned' },
  { id: 'v4', name: 'Diya Nair', event: 'NextGen React Masterclass', role: 'Stage Manager', status: 'Completed' },
];

export default function AdvancedDataTable() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'volunteers'>('registrations');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>('student');
  const [sortAsc, setSortAsc] = useState(true);

  const pageSize = 4;

  const surfaceBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const handleExportCSV = () => {
    if (activeTab === 'registrations') {
      exportToCSV(
        'Registrations_Report',
        ['Student Name', 'Email', 'Event', 'Registration Date', 'Status', 'Attendance'],
        mockRegistrations.map(r => [r.student, r.email, r.event, r.regDate, r.status, r.attendance])
      );
    } else if (activeTab === 'events') {
      exportToCSV(
        'Events_Report',
        ['Event Title', 'Organizer', 'Date', 'Capacity', 'Registrations', 'Status'],
        mockEvents.map(e => [e.title, e.organizer, e.date, e.capacity, e.registrations, e.status])
      );
    } else {
      exportToCSV(
        'Volunteers_Report',
        ['Volunteer Name', 'Assigned Event', 'Role', 'Status'],
        mockVolunteers.map(v => [v.name, v.event, v.role, v.status])
      );
    }
  };

  const handleExportPDF = () => {
    if (activeTab === 'registrations') {
      exportToPDF(
        'Recent Registrations Report',
        ['Student Name', 'Email', 'Event', 'Registration Date', 'Status', 'Attendance'],
        mockRegistrations.map(r => [r.student, r.email, r.event, r.regDate, r.status, r.attendance])
      );
    } else if (activeTab === 'events') {
      exportToPDF(
        'Platform Events Report',
        ['Event Title', 'Organizer', 'Date', 'Capacity', 'Registrations', 'Status'],
        mockEvents.map(e => [e.title, e.organizer, e.date, e.capacity, e.registrations, e.status])
      );
    } else {
      exportToPDF(
        'Volunteer Assignments Roster',
        ['Volunteer Name', 'Assigned Event', 'Role', 'Status'],
        mockVolunteers.map(v => [v.name, v.event, v.role, v.status])
      );
    }
  };

  return (
    <div className={`rounded-2xl border ${surfaceBg} overflow-hidden space-y-4 p-6`}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-base font-extrabold ${textPri}`}>Platform Data Tables & Roster</h3>
          <p className={`text-xs font-medium mt-0.5 ${textSub}`}>Search, sort, filter, and export system records</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-800/40 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => { setActiveTab('registrations'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'registrations' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
            }`}
          >
            Registrations
          </button>
          <button
            onClick={() => { setActiveTab('events'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'events' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
            }`}
          >
            Events
          </button>
          <button
            onClick={() => { setActiveTab('volunteers'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'volunteers' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
            }`}
          >
            Volunteers
          </button>
        </div>
      </div>

      {/* Filter Bar & Export Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/40">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium outline-none transition-all ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-amber-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-extrabold flex items-center justify-center gap-1.5 border border-zinc-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" /> Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-950" /> Export PDF
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        {activeTab === 'registrations' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'} font-extrabold uppercase tracking-wider`}>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Event</th>
                <th className="py-3 px-3">Registration Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {mockRegistrations.map(r => (
                <tr key={r.id} className={isDark ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'}>
                  <td className="py-3 px-3">
                    <p className={`font-extrabold ${textPri}`}>{r.student}</p>
                    <p className={`text-[10px] ${textSub}`}>{r.email}</p>
                  </td>
                  <td className={`py-3 px-3 font-semibold ${textPri}`}>{r.event}</td>
                  <td className={`py-3 px-3 ${textSub}`}>{r.regDate}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      r.attendance === 'Checked In' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {r.attendance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'events' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'} font-extrabold uppercase tracking-wider`}>
                <th className="py-3 px-3">Event</th>
                <th className="py-3 px-3">Organizer</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Capacity</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {mockEvents.map(e => (
                <tr key={e.id} className={isDark ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'}>
                  <td className={`py-3 px-3 font-extrabold ${textPri}`}>{e.title}</td>
                  <td className={`py-3 px-3 font-semibold ${textSub}`}>{e.organizer}</td>
                  <td className={`py-3 px-3 ${textSub}`}>{e.date}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-amber-400">{e.registrations} / {e.capacity}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      e.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      e.status === 'Upcoming' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'volunteers' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'} font-extrabold uppercase tracking-wider`}>
                <th className="py-3 px-3">Volunteer</th>
                <th className="py-3 px-3">Assigned Event</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {mockVolunteers.map(v => (
                <tr key={v.id} className={isDark ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'}>
                  <td className={`py-3 px-3 font-extrabold ${textPri}`}>{v.name}</td>
                  <td className={`py-3 px-3 font-semibold ${textSub}`}>{v.event}</td>
                  <td className={`py-3 px-3 ${textPri}`}>{v.role}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40 text-xs">
        <span className={textSub}>Showing Page 1 of 1</span>
        <div className="flex items-center gap-1">
          <button disabled className="p-1.5 rounded-lg border border-zinc-800 text-zinc-600 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button disabled className="p-1.5 rounded-lg border border-zinc-800 text-zinc-600 disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
