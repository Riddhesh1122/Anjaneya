import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, UserCheck, Award } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AIWidgetProps {
  onLaunchAI: () => void;
  onVolunteerMatch: () => void;
}

const suggestions = [
  {
    icon: Brain,
    label: 'Generate event for 200 students',
    tag: 'Event AI',
    color: 'text-violet-400',
  },
  {
    icon: UserCheck,
    label: 'Match volunteers for Hackathon roles',
    tag: 'Matching',
    color: 'text-emerald-400',
  },
  {
    icon: Award,
    label: 'Draft certificates for 48 attendees',
    tag: 'Certificates',
    color: 'text-amber-500',
  },
];

export default function AIWidget({ onLaunchAI, onVolunteerMatch }: AIWidgetProps) {
  const { isDark } = useTheme();

  const surface = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-950';
  const textMuted = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const rowHover = isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-50';
  const tagBg = isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-100 text-zinc-800 border-zinc-200';

  return (
    <div className={`rounded-2xl border ${surface} overflow-hidden flex flex-col justify-between h-full`}>
      <div>
        {/* Header */}
        <div className={`px-6 py-4.5 border-b ${divider} flex items-center gap-3`}>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-sm shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className={`text-base font-extrabold ${textPrimary}`}>AI Assistant Copilot</h3>
            <p className={`text-xs font-medium ${textSub}`}>Powered by Gemini · GPT-4o · Groq</p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="divide-y divide-zinc-800/40">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
                onClick={s.label.includes('volunteer') ? onVolunteerMatch : onLaunchAI}
                className={`w-full px-6 py-4 flex items-center gap-3 text-left transition-colors cursor-pointer ${rowHover}`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${isDark ? 'bg-zinc-800/80 border border-zinc-700/60' : 'bg-zinc-100 border border-zinc-200'}`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <span className={`text-sm font-bold flex-1 leading-snug ${textPrimary}`}>{s.label}</span>
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border flex-shrink-0 ${tagBg}`}>
                  {s.tag}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className={`px-6 py-4.5 border-t ${divider}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLaunchAI}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/30"
        >
          <Sparkles className="w-4 h-4 text-zinc-950" />
          Open AI Studio & Copilot
          <ArrowRight className="w-4 h-4 ml-auto" />
        </motion.button>
      </div>
    </div>
  );
}
