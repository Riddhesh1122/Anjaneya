import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const feed = [
  { id: 1, initials: 'AK', name: 'Aarav Kulkarni', action: 'registered for', target: 'AI Summit 2026', time: '2 min ago', color: '#f59e0b' },
  { id: 2, initials: 'PS', name: 'Priya Sharma', action: 'was matched as volunteer for', target: 'Hackathon Stage A', time: '14 min ago', color: '#6366f1' },
  { id: 3, initials: 'RV', name: 'Rohan Verma', action: 'completed task', target: 'Check-in booth setup', time: '32 min ago', color: '#10b981' },
  { id: 4, initials: 'SJ', name: 'Sneha Joshi', action: 'generated certificate for', target: 'Cyber Security Workshop', time: '1 hr ago', color: '#a855f7' },
  { id: 5, initials: 'KM', name: 'Kiran Mehta', action: 'created event', target: 'Open Source Sprint', time: '2 hr ago', color: '#f43f5e' },
];

export default function ActivityFeed() {
  const { isDark } = useTheme();

  const surface = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const textSub = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const lineBg = isDark ? 'bg-zinc-800' : 'bg-zinc-200';

  return (
    <div className={`rounded-xl border ${surface} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b ${divider}`}>
        <h3 className={`text-sm font-semibold ${textPrimary}`}>Recent Activity</h3>
        <p className={`text-xs mt-0.5 ${textMuted}`}>Live platform event stream</p>
      </div>

      {/* Timeline */}
      <div className="px-5 py-4 space-y-0">
        {feed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.07 }}
            className="flex gap-4"
          >
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: item.color }}
              >
                {item.initials}
              </div>
              {i < feed.length - 1 && <div className={`w-px flex-1 mt-1 mb-1 ${lineBg}`} />}
            </div>

            {/* Content */}
            <div className={`pb-4 flex-1 min-w-0 ${i === feed.length - 1 ? '' : ''}`}>
              <p className={`text-xs leading-relaxed ${textPrimary}`}>
                <strong className="font-semibold">{item.name}</strong>
                {' '}{item.action}{' '}
                <span className="text-amber-500 font-medium">{item.target}</span>
              </p>
              <p className={`text-[11px] mt-0.5 ${textSub}`}>{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
