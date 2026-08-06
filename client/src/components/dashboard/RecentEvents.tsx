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
  'Artificial Intelligence': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Hackathons': 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  'Cyber Security': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  'AI Generated': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
};
const DEFAULT_COLOR = 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';

const CAPACITY = 500;

export default function RecentEvents({ events, onViewDetails, onGetQR }: RecentEventsProps) {
  const { isDark } = useTheme();

  const surface = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const hoverBorder = isDark ? 'hover:border-zinc-700' : 'hover:border-zinc-300';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-950';
  const textMuted = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';

  return (
    <div className={`rounded-2xl border ${surface} overflow-hidden flex flex-col justify-between h-full`}>
      <div>
        {/* Header */}
        <div className={`px-6 py-4.5 border-b ${divider} flex items-center justify-between`}>
          <div>
            <h3 className={`text-base font-extrabold ${textPrimary}`}>Recent Events</h3>
            <p className={`text-xs font-medium mt-0.5 ${textSub}`}>{events.length} active events on platform</p>
          </div>
          <button className="text-xs text-amber-500 font-extrabold hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Event list */}
        <div className="divide-y divide-zinc-800/40">
          {events.slice(0, 4).map((ev, i) => {
            const pct = Math.min(Math.round((ev.attendees / CAPACITY) * 100), 100);
            const catColor = CATEGORY_COLORS[ev.category] || DEFAULT_COLOR;

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className={`px-6 py-4 group transition-all cursor-pointer ${hoverBorder} ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'}`}
                onClick={() => onViewDetails(ev)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    i === 0 ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : i === 1 ? 'bg-violet-500' : 'bg-emerald-500'
                  }`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className={`text-sm font-extrabold truncate ${textPrimary}`}>{ev.title}</p>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${catColor}`}>
                        {ev.category}
                      </span>
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 text-xs font-medium ${textMuted} mb-2`}>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />{ev.date}
                      </span>
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />{ev.location.split('/')[0].trim()}
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div className="flex items-center gap-2.5">
                      <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                          className="h-full rounded-full bg-amber-500"
                        />
                      </div>
                      <span className={`text-xs font-mono font-semibold ${textSub}`}>
                        <Users className="w-3.5 h-3.5 inline mr-1" />{ev.attendees}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); onGetQR(ev); }}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700' : 'bg-zinc-100 text-amber-600 hover:bg-zinc-200'}`}
                      title="Generate QR Pass"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {events.length === 0 && (
            <div className={`px-5 py-8 text-center text-sm font-medium ${textMuted}`}>
              No events yet. Create your first event!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
