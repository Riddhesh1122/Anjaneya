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
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const divider = isDark ? 'border-zinc-800' : 'border-zinc-100';
  const rowHover = isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-50';
  const tagBg = isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500';

  return (
    <div className={`rounded-xl border ${surface} overflow-hidden flex flex-col`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b ${divider} flex items-center gap-2`}>
        <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${textPrimary}`}>AI Assistant</h3>
          <p className={`text-xs ${textMuted}`}>Powered by Gemini · GPT-4o · Groq</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex-1 divide-y divide-zinc-800/40">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              onClick={s.label.includes('volunteer') ? onVolunteerMatch : onLaunchAI}
              className={`w-full px-5 py-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${rowHover}`}
            >
              <div className={`p-1.5 rounded-md ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <span className={`text-xs flex-1 leading-relaxed ${textPrimary}`}>{s.label}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagBg}`}>
                {s.tag}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <div className={`px-5 py-4 border-t ${divider}`}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onLaunchAI}
          className="w-full py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Open AI Studio
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </motion.button>
      </div>
    </div>
  );
}
