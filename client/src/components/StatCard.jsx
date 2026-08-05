import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated stat card with smooth count-up or clean formatted value.
 */
export default function StatCard({ title, value, icon, trend, trendUp, color, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (typeof value === 'number') {
      const duration = 1200;
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, value]);

  const formatValue = () => {
    if (typeof value === 'string') return value;
    return (displayValue || 0).toLocaleString();
  };

  const colorMap = {
    indigo: { bg: 'from-indigo-500/20 to-indigo-600/5', icon: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-500/20', text: 'text-indigo-400' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/5', icon: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20', text: 'text-emerald-400' },
    amber: { bg: 'from-amber-500/20 to-amber-600/5', icon: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20', text: 'text-amber-400' },
    rose: { bg: 'from-rose-500/20 to-rose-600/5', icon: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-500/20', text: 'text-rose-400' },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.bg} border border-white/10 p-6 backdrop-blur-xl shadow-xl`}
    >
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${c.icon} rounded-full opacity-10 blur-2xl`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{formatValue()}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              <svg className={`w-3.5 h-3.5 ${trendUp ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.icon} shadow-lg ${c.shadow}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
