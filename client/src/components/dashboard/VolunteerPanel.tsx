import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const volunteers = [
  { name: 'Aarav Sharma', role: 'Check-in Lead', score: 96, skills: ['Registration', 'React'], status: 'Assigned', color: '#f59e0b' },
  { name: 'Priya Patel', role: 'AV Stage Setup', score: 91, skills: ['AV Sound', 'Logistics'], status: 'Confirmed', color: '#6366f1' },
  { name: 'Rohan Verma', role: 'Speaker Liaison', score: 88, skills: ['PR', 'Python'], status: 'Pending', color: '#10b981' },
];

const statusStyle: Record<string, string> = {
  Assigned: 'bg-amber-500/15 text-amber-500 border border-amber-500/30',
  Confirmed: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30',
  Pending: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30',
};

export default function VolunteerPanel() {
  const { isDark } = useTheme();

  const surface = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-950';
  const textMuted = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const trackBg = isDark ? 'bg-zinc-800' : 'bg-zinc-200';
  const tagBg = isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-100 text-zinc-800 border-zinc-200';

  return (
    <div className={`rounded-xl border ${surface} overflow-hidden flex flex-col justify-between h-full`}>
      <div>
        {/* Header */}
        <div className={`px-5 py-4 border-b ${divider} flex items-center justify-between`}>
          <div>
            <h3 className={`text-base font-bold ${textPrimary}`}>Top Volunteers</h3>
            <p className={`text-xs font-medium mt-0.5 ${textSub}`}>AI match score & performance</p>
          </div>
          <button className="text-xs text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
            All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volunteer list */}
        <div className="p-5 space-y-4">
          {volunteers.map((vol, i) => (
            <motion.div
              key={vol.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-2">
                {/* Rank + Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                    style={{ background: vol.color }}
                  >
                    {vol.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                    i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-zinc-500' : 'bg-orange-700'
                  }`}>
                    {i + 1}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold truncate ${textPrimary}`}>{vol.name}</p>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusStyle[vol.status]}`}>
                      {vol.status}
                    </span>
                  </div>
                  <p className={`text-xs font-medium truncate ${textMuted}`}>{vol.role}</p>
                </div>
              </div>

              {/* Skill fit bar */}
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-1.5 rounded-full ${trackBg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${vol.score}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.4 }}
                    className="h-full rounded-full"
                    style={{ background: vol.color }}
                  />
                </div>
                <span className={`text-xs font-bold ${textMuted} w-10 text-right`}>{vol.score}%</span>
              </div>

              {/* Skills */}
              <div className="flex gap-1.5 mt-2">
                {vol.skills.map(s => (
                  <span key={s} className={`text-xs font-semibold px-2 py-0.5 rounded border ${tagBg}`}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
