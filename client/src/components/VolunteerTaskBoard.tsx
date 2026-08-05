import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Filter, UserCheck, CheckSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';

export interface TaskItem {
  id: string;
  title: string;
  eventTitle: string;
  assignedTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  category: string;
  requiredSkills: string[];
}

const initialVolunteerTasks: TaskItem[] = [
  {
    id: 'task-101',
    title: 'Attendee Registration Desk Check-in',
    eventTitle: 'AI & ML Innovations Summit 2026',
    assignedTime: '09:00 AM - 12:00 PM',
    status: 'In Progress',
    category: 'Logistics',
    requiredSkills: ['QR Scanning', 'Public Assistance'],
  },
  {
    id: 'task-102',
    title: 'Speaker Green Room Setup & Mic Checks',
    eventTitle: 'AI & ML Innovations Summit 2026',
    assignedTime: '11:30 AM - 01:00 PM',
    status: 'Pending',
    category: 'Stage Management',
    requiredSkills: ['Audio Tech', 'VIP Escort'],
  },
  {
    id: 'task-103',
    title: 'Hackathon Badge Verification & Swag Distribution',
    eventTitle: 'Global Hackathon & Code Sprint',
    assignedTime: '02:00 PM - 05:00 PM',
    status: 'Pending',
    category: 'Operations',
    requiredSkills: ['Crowd Flow', 'Inventory'],
  },
  {
    id: 'task-104',
    title: 'Pre-Event Venue Direction Signage Setup',
    eventTitle: 'Cyber Security & Zero Trust Workshop',
    assignedTime: '08:00 AM - 09:30 AM',
    status: 'Completed',
    category: 'Setup',
    requiredSkills: ['Physical Setup'],
  },
];

export default function VolunteerTaskBoard() {
  const { isDark } = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>(initialVolunteerTasks);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus: TaskItem['status'] =
            t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filteredTasks = tasks.filter((t) => (statusFilter === 'All' ? true : t.status === statusFilter));
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const trackBg = isDark ? 'bg-zinc-800' : 'bg-zinc-200';

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className={`p-5 rounded-xl border ${cardBg} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="amber" className="mb-2">
              <UserCheck className="w-3 h-3 mr-1" /> Volunteer Duty Command
            </Badge>
            <h2 className={`text-lg font-bold ${textPri}`}>Assigned Tasks & Shifts</h2>
            <p className={`text-xs mt-0.5 ${textMut}`}>
              Track real-time volunteer duties, log task completions, and gain verified volunteer credits.
            </p>
          </div>

          {/* Progress Widget */}
          <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} min-w-[200px]`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={`font-medium ${textMut}`}>Completion Rate</span>
              <span className="text-amber-500 font-bold">{progressPercent}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full ${trackBg} overflow-hidden`}>
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <div className={`text-[10px] mt-1.5 text-right ${textMut}`}>
              {completedCount} of {tasks.length} Duties Completed
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className={`w-3.5 h-3.5 ${textMut}`} />
          <span className={`text-xs font-medium mr-1 ${textMut}`}>Filter Status:</span>
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6 text-amber-500" />}
          title="No duties found"
          description={`No volunteer duties match the current filter status "${statusFilter}".`}
          actionLabel="Show All Tasks"
          onAction={() => setStatusFilter('All')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`p-5 rounded-xl border ${cardBg} hover:border-amber-500/40 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${textMut}`}>{t.category}</span>
                      <h3 className={`text-sm font-semibold mt-0.5 ${textPri}`}>{t.title}</h3>
                      <p className="text-xs text-amber-500 font-medium mt-0.5">{t.eventTitle}</p>
                    </div>

                    <button
                      onClick={() => toggleTaskStatus(t.id)}
                      className="cursor-pointer"
                    >
                      {t.status === 'Completed' && <Badge variant="emerald"><CheckCircle2 className="w-3 h-3 mr-1" /> {t.status}</Badge>}
                      {t.status === 'In Progress' && <Badge variant="amber"><Clock className="w-3 h-3 mr-1" /> {t.status}</Badge>}
                      {t.status === 'Pending' && <Badge variant="zinc"><AlertCircle className="w-3 h-3 mr-1" /> {t.status}</Badge>}
                    </button>
                  </div>
                </div>

                <div className={`mt-4 pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'} flex items-center justify-between text-xs`}>
                  <span className={`flex items-center gap-1.5 ${textMut}`}>
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {t.assignedTime}
                  </span>

                  <div className="flex items-center gap-1">
                    {t.requiredSkills.map((sk) => (
                      <span key={sk} className={`px-2 py-0.5 rounded text-[10px] ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
