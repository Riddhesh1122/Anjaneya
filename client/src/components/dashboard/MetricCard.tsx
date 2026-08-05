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
      className={`rounded-xl border p-5 transition-all duration-200 cursor-default ${
        isDark
          ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
          {icon}
        </div>
        {/* Trend badge */}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendUp
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-rose-500/10 text-rose-500'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {/* Label */}
      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {title}
      </p>

      {/* Value */}
      <p className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-zinc-50' : 'text-zinc-900'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {/* Sparkline */}
      <div className="flex items-end gap-0.5 mt-4 h-8">
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
                : isDark ? 'bg-zinc-700' : 'bg-zinc-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
