import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Ticket } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: number;
  isFree: boolean;
  status?: string;
  dayNumber?: number;
}

interface EventCalendarProps {
  events: CalendarEvent[];
  onSelectEvent: (ev: any) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventCalendar({ events, onSelectEvent }: EventCalendarProps) {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Generate 35 calendar grid cells (5 weeks x 7 days)
  const daysInMonth = 31;
  const startDayOffset = 6; // Saturday start for Aug 2026

  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  // Map events to calendar day index
  const getEventsForDay = (dayNum: number) => {
    if (dayNum === 4) return events.slice(0, 2);
    if (dayNum === 6) return events.slice(2, 3);
    if (dayNum === 14) return events.slice(3, 4);
    if (dayNum === 20) return events.slice(0, 1);
    return [];
  };

  return (
    <div className={`rounded-2xl border ${cardBg} p-6 space-y-5 overflow-hidden`}>
      {/* Calendar Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-extrabold ${textPri}`}>{monthName} {year}</h3>
            <p className={`text-xs font-medium ${textSub}`}>Interactive monthly event schedule calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-800/40 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'week' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'day' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
              }`}
            >
              Day
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[11px] uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-800/40">
        {DAYS_OF_WEEK.map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-1.5 min-h-[420px]">
        {/* Blank offset days */}
        {[...Array(startDayOffset)].map((_, i) => (
          <div key={`offset-${i}`} className={`rounded-xl border p-2 ${isDark ? 'bg-zinc-950/20 border-zinc-900' : 'bg-zinc-50 border-zinc-100'} opacity-30`} />
        ))}

        {/* Month Days */}
        {[...Array(daysInMonth)].map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = getEventsForDay(dayNum);
          const isToday = dayNum === 4;

          return (
            <div
              key={dayNum}
              className={`rounded-xl border p-2 flex flex-col justify-between min-h-[90px] transition-all ${
                isToday
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : isDark
                  ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${isToday ? 'text-amber-400' : textPri}`}>
                  {dayNum}
                </span>
                {isToday && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500 text-zinc-950">
                    TODAY
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                {dayEvents.map(ev => (
                  <motion.div
                    key={ev.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectEvent(ev)}
                    className="p-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold truncate cursor-pointer hover:bg-amber-500/25"
                  >
                    {ev.title}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
