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
  const max = Math.max(...sparkline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`rounded-xl border p-5 transition-all duration-200 cursor-default flex flex-col justify-between h-full ${
        isDark
          ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          {/* Icon */}
          <div className={`p-2.5 rounded-lg ${isDark ? 'bg-zinc-800 text-amber-500' : 'bg-zinc-100 text-amber-600'}`}>
            {icon}
          </div>
          {/* Trend badge */}
          {trend && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              trendUp
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
            }`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>

        {/* Label */}
        <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
          {title}
        </p>

        {/* Value */}
        <p className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Sparkline */}
      <div className="flex items-end gap-1 mt-4 h-9">
        {sparkline.map((v, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: delay + i * 0.04, duration: 0.3, ease: 'easeOut' }}
            style={{ height: `${(v / max) * 100}%` }}
            className={`flex-1 rounded-sm origin-bottom ${
              i === sparkline.length - 1
                ? 'bg-amber-500'
                : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
