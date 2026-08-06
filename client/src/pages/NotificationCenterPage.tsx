import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Search, CheckCircle2, AlertTriangle, Info, ShieldAlert, Check,
  Calendar, Ticket, UserCheck, Award, MessageSquare, Filter, RefreshCw
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Success' | 'Info' | 'Warning' | 'Error';
  category: 'Event' | 'Registration' | 'Volunteer' | 'Attendance' | 'Announcement' | 'Certificate' | 'Reminder' | 'System';
  actionUrl: string;
  readStatus: boolean;
  createdAt: string;
}

const initialNotifications: NotificationItem[] = [
  { id: 'n1', title: 'AI Matching Completed', message: 'Matched 3 volunteers for AI & ML Summit', type: 'Success', category: 'Volunteer', actionUrl: 'volunteers', readStatus: false, createdAt: '2 mins ago' },
  { id: 'n2', title: 'Global Hackathon Capacity Warning', message: 'Registration reached 80% capacity (280/350)', type: 'Warning', category: 'Event', actionUrl: 'events', readStatus: false, createdAt: '15 mins ago' },
  { id: 'n3', title: 'QR Code Ticket Scan Activity', message: '115 attendees checked in at venue gate', type: 'Info', category: 'Attendance', actionUrl: 'scanner', readStatus: true, createdAt: '1 hour ago' },
  { id: 'n4', title: 'Certificates Dispatched', message: 'AI certificate batch issued to eligible attendees', type: 'Success', category: 'Certificate', actionUrl: 'events', readStatus: true, createdAt: '2 hours ago' },
  { id: 'n5', title: 'System Security Audit Completed', message: 'HMAC SHA-256 tokens & JWT authorization healthy', type: 'Info', category: 'System', actionUrl: 'settings', readStatus: true, createdAt: 'Yesterday' },
];

export default function NotificationCenterPage() {
  const { isDark } = useTheme();
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const markSingleRead = (id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, readStatus: true } : n)));
  };

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, readStatus: true })));
  };

  const filtered = items.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchType = selectedType === 'All' || n.type === selectedType;
    const matchUnread = !unreadOnly || !n.readStatus;
    return matchSearch && matchCat && matchType && matchUnread;
  });

  const unreadCount = items.filter(n => !n.readStatus).length;

  const categoryIcons: Record<string, React.ReactNode> = {
    Event: <Calendar className="w-4 h-4 text-amber-500" />,
    Registration: <Ticket className="w-4 h-4 text-indigo-400" />,
    Volunteer: <UserCheck className="w-4 h-4 text-emerald-400" />,
    Attendance: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
    Announcement: <MessageSquare className="w-4 h-4 text-rose-400" />,
    Certificate: <Award className="w-4 h-4 text-violet-400" />,
    System: <ShieldAlert className="w-4 h-4 text-amber-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="amber">
              <Bell className="w-3.5 h-3.5 mr-1" /> Real-Time Notifications
            </Badge>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h2 className={`text-xl font-extrabold ${textPri}`}>Notification Center</h2>
          <p className={`text-xs font-medium ${textSub}`}>Role-scoped alerts, real-time broadcasts, and automated triggers</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={<Check className="w-4 h-4 text-emerald-400" />}>
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                unreadOnly ? 'bg-amber-500 text-zinc-950 border-amber-500' : `${cardBg} ${textSub}`
              }`}
            >
              Unread Only ({unreadCount})
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/40">
          {['All', 'Event', 'Registration', 'Volunteer', 'Attendance', 'Certificate', 'System'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Stream List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => markSingleRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.readStatus
                  ? isDark
                    ? 'bg-zinc-900/90 border-amber-500/30 shadow-md'
                    : 'bg-amber-50/50 border-amber-200 shadow-sm'
                  : cardBg
              }`}
            >
              <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex-shrink-0">
                {categoryIcons[n.category] || <Bell className="w-4 h-4 text-amber-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-extrabold ${textPri}`}>{n.title}</span>
                  <span className={`text-[10px] ${textSub} flex-shrink-0`}>{n.createdAt}</span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${textSub}`}>{n.message}</p>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    n.type === 'Success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    n.type === 'Warning' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  }`}>
                    {n.type}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{n.category}</span>
                </div>
              </div>

              {!n.readStatus && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className={`p-12 rounded-2xl border ${cardBg} text-center space-y-2`}>
            <Bell className="w-8 h-8 text-zinc-500 mx-auto opacity-40" />
            <p className={`text-sm font-extrabold ${textPri}`}>No notifications found</p>
            <p className={`text-xs ${textSub}`}>Try resetting filters or search queries</p>
          </div>
        )}
      </div>
    </div>
  );
}
