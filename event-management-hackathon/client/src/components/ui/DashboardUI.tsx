import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  PlusSquare,
  Users,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { EventItem, dashboardApi } from '../../services/dashboardApi';

// Small reusable stat card
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  delta?: string;
  color?: string;
  icon?: React.ReactNode;
}> = ({ title, value, delta, color = 'bg-white', icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl p-4 shadow-md ${color} text-slate-900 transition-transform`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-white/60 flex items-center justify-center">{icon}</div>
      </div>
      {delta && <p className="mt-3 text-sm text-slate-600">{delta}</p>}
    </motion.div>
  );
};

// Sidebar + navbar + small components are grouped here to avoid extra folders
export const Sidebar: React.FC<{
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}> = ({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
    { id: 'create', label: 'Create Event', icon: <PlusSquare className="h-5 w-5" /> },
    { id: 'volunteers', label: 'Volunteers', icon: <Users className="h-5 w-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'registrations', label: 'Registrations', icon: <FileText className="h-5 w-5" /> },
    { id: 'certificates', label: 'Certificates', icon: <FileText className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
    { id: 'logout', label: 'Logout', icon: <LogOut className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex lg:w-64 lg:flex-col lg:gap-y-6 lg:bg-white lg:py-6 lg:px-4 lg:shadow`}> 
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">A</div>
          <div>
            <p className="font-semibold">Anjaneya</p>
            <p className="text-xs text-slate-500">Event Management</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1 px-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition`}
              href="#"
            >
              <span className="text-slate-500 group-hover:text-blue-600">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="px-2">
          <button
            onClick={onToggleCollapsed}
            className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Collapse
          </button>
        </div>
      </aside>

      {/* Mobile / tablet slide-out */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-4 shadow-lg transition-transform lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">A</div>
            <div>
              <p className="font-semibold">Anjaneya</p>
              <p className="text-xs text-slate-500">Event Management</p>
            </div>
          </div>
          <button onClick={onCloseMobile} aria-label="Close menu" className="p-2">
            <X />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <a key={item.id} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700" href="#">
              <span className="text-slate-500">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

      </div>
    </>
  );
};

export const Navbar: React.FC<{ onToggleMobileMenu: () => void; onToggleCollapsed: () => void }> = ({ onToggleMobileMenu, onToggleCollapsed }) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <button onClick={onToggleMobileMenu} className="lg:hidden p-2">
          <Menu />
        </button>
        <div className="hidden items-center gap-3 rounded-md border border-slate-100 p-2 sm:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input placeholder="Search events, volunteers..." className="w-64 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:text-slate-800"><Bell /></button>
        <button className="p-2 text-slate-600 hover:text-slate-800"><Sun className="h-4 w-4" /></button>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">U</div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">Priya</p>
            <p className="text-xs text-slate-500">Welcome back</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export const RecentEventsTable: React.FC<{ events: EventItem[] }> = ({ events }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">Recent Events</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Venue</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Participants</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="mt-2">
            {events.map((e) => (
              <tr key={e.id} className="border-t border-slate-100">
                <td className="px-3 py-3">
                  <div className="text-sm font-medium">{e.name}</div>
                </td>
                <td className="px-3 py-3 text-sm text-slate-600">{new Date(e.date).toLocaleDateString()}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{e.venue}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${e.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' : e.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm">{e.participants}</td>
                <td className="px-3 py-3 text-sm">
                  <button className="rounded-md bg-blue-600 px-3 py-1 text-white">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const UpcomingEventCard: React.FC<{ event: EventItem }> = ({ event }) => {
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-2xl bg-white p-4 shadow">
      <div className="h-28 rounded-md bg-slate-100" />
      <h4 className="mt-3 text-lg font-semibold">{event.name}</h4>
      <p className="mt-1 text-sm text-slate-500">{new Date(event.date).toLocaleDateString()} • {event.time}</p>
      <p className="mt-2 text-sm text-slate-600">{event.venue}</p>
      <div className="mt-4">
        <button className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-white">Register</button>
      </div>
    </motion.div>
  );
};

export const NotificationsPanel: React.FC<{ items: { id: string; text: string }[] }> = ({ items }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">Notifications</h3>
      <ul className="mt-3 space-y-2">
        {items.map((n) => (
          <li key={n.id} className="text-sm text-slate-700">{n.text}</li>
        ))}
      </ul>
    </div>
  );
};

export const ProfileCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">P</div>
      <h4 className="mt-3 text-lg font-semibold">Priya Sharma</h4>
      <p className="text-sm text-slate-500">Organizer</p>
      <p className="mt-2 text-sm text-slate-600">priya@example.com</p>
      <div className="mt-3">
        <button className="rounded-md bg-slate-100 px-3 py-1 text-sm">Edit Profile</button>
      </div>
    </div>
  );
};

export const ChartsPlaceholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="rounded-2xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 h-40 w-full rounded-md bg-slate-100" />
    </motion.div>
  );
};

export default {
  StatCard,
  Sidebar,
  Navbar,
  RecentEventsTable,
  UpcomingEventCard,
  NotificationsPanel,
  ProfileCard,
  ChartsPlaceholder,
};
