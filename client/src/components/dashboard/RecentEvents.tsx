import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, QrCode } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: number;
  isFree: boolean;
  price?: number;
  needsVolunteers?: boolean;
}

interface RecentEventsProps {
  events: Event[];
  onViewDetails: (ev: Event) => void;
  onGetQR: (ev: Event) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Artificial Intelligence': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Hackathons': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Cyber Security': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'AI Generated': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};
const DEFAULT_COLOR = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';

const CAPACITY = 500;

export default function RecentEvents({ events, onViewDetails, onGetQR }: RecentEventsProps) {
  const { isDark } = useTheme();

  const surface = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const hoverBorder = isDark ? 'hover:border-zinc-700' : 'hover:border-zinc-300';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';

  return (
    <div className={`rounded-xl border ${surface} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b ${divider} flex items-center justify-between`}>
        <div>
          <h3 className={`text-sm font-semibold ${textPrimary}`}>Recent Events</h3>
          <p className={`text-xs mt-0.5 ${textMuted}`}>{events.length} active events</p>
        </div>
        <button className="text-xs text-amber-500 font-medium hover:text-amber-400 transition-colors flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Event list */}
      <div className="divide-y divide-zinc-800/50">
        {events.slice(0, 4).map((ev, i) => {
          const pct = Math.min(Math.round((ev.attendees / CAPACITY) * 100), 100);
          const catColor = CATEGORY_COLORS[ev.category] || DEFAULT_COLOR;

          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              className={`px-5 py-4 group transition-all ${hoverBorder} ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'}`}
            >
              <div className="flex items-start gap-3">
                {/* Color dot */}
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-violet-500' : 'bg-emerald-500'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-medium truncate ${textPrimary}`}>{ev.title}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${catColor}`}>
                      {ev.category}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 text-xs ${textMuted} mb-2`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{ev.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{ev.location.split('/')[0].trim()}
                    </span>
                  </div>

                  {/* Capacity bar */}
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-1 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                        className="h-full rounded-full bg-amber-500"
                      />
                    </div>
                    <span className={`text-[10px] font-mono ${textMuted}`}>
                      <Users className="w-3 h-3 inline mr-0.5" />{ev.attendees}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => onGetQR(ev)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}
                    title="QR Pass"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {events.length === 0 && (
          <div className={`px-5 py-8 text-center text-sm ${textMuted}`}>
            No events yet. Create your first event!
          </div>
        )}
      </div>
    </div>
  );
}
