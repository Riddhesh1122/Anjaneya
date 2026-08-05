import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

/* Registration & volunteer growth data */
const data = [
  { name: 'Jan', registrations: 820, volunteers: 140 },
  { name: 'Feb', registrations: 1040, volunteers: 175 },
  { name: 'Mar', registrations: 950, volunteers: 160 },
  { name: 'Apr', registrations: 1380, volunteers: 210 },
  { name: 'May', registrations: 1650, volunteers: 255 },
  { name: 'Jun', registrations: 1480, volunteers: 238 },
  { name: 'Jul', registrations: 1820, volunteers: 290 },
  { name: 'Aug', registrations: 2100, volunteers: 340 },
  { name: 'Sep', registrations: 1950, volunteers: 310 },
  { name: 'Oct', registrations: 2380, volunteers: 380 },
  { name: 'Nov', registrations: 2200, volunteers: 350 },
  { name: 'Dec', registrations: 2760, volunteers: 430 },
];

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-xl border px-4 py-3 shadow-xl text-xs backdrop-blur-sm ${
        isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-zinc-200/40'
      }`}>
        <p className={`font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="font-medium" style={{ color: entry.color }}>
            {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartSection() {
  const { isDark } = useTheme();

  const surface = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDark ? '#52525b' : '#a1a1aa';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className={`rounded-xl border ${surface} p-5 h-full`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className={`text-sm font-semibold ${textPri}`}>Registration Trend</h3>
          <p className={`text-xs mt-0.5 ${textMut}`}>Monthly event registrations & volunteer growth</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className={`flex items-center gap-1.5 ${textMut}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            Registrations
          </span>
          <span className={`flex items-center gap-1.5 ${textMut}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 flex-shrink-0" />
            Volunteers
          </span>
        </div>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area
              type="monotone"
              dataKey="registrations"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#regGradient)"
              name="Registrations"
            />
            <Area
              type="monotone"
              dataKey="volunteers"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#volGradient)"
              name="Volunteers"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
