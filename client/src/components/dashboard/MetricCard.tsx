import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  sparkline?: number[];
  delay?: number;
}

const DEFAULT_SPARK = [40, 55, 48, 70, 62, 80, 72, 90];

export default function MetricCard({
  title, value, trend, trendUp = true, icon, sparkline = DEFAULT_SPARK, delay = 0
}: MetricCardProps) {
  const { isDark } = useTheme();
  const max = Math.max(...sparkline, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-2xl border p-6 transition-all duration-200 cursor-default flex flex-col justify-between h-full ${
        isDark
          ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 shadow-md shadow-zinc-950/40'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm shadow-zinc-200/50'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          {/* Icon */}
          <div className={`p-3 rounded-xl flex items-center justify-center ${isDark ? 'bg-zinc-800/80 text-amber-400 border border-zinc-700/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'}`}>
            {icon}
          </div>
          {/* Trend badge */}
          {trend && (
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
              trendUp
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>

        {/* Label */}
        <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
          {title}
        </p>

        {/* Value */}
        <p className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Sparkline */}
      <div className="flex items-end gap-1 mt-5 h-9">
        {sparkline.map((v, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: delay + i * 0.04, duration: 0.3, ease: 'easeOut' }}
            style={{ height: `${(v / max) * 100}%` }}
            className={`flex-1 rounded-sm origin-bottom ${
              i === sparkline.length - 1
                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                : isDark ? 'bg-zinc-800' : 'bg-zinc-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
