import { motion } from 'framer-motion';
import { Sparkles, Calendar, Mail, UserCheck, Megaphone, Clock, FileText, ShieldAlert, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Badge } from '../ui/Badge';
import { GeneratorMode } from './AIGeneratorModal';

interface AIPromptLibraryProps {
  onSelectPrompt: (mode: GeneratorMode, prefillData?: any) => void;
}

const promptCards = [
  {
    id: 'p-1',
    title: 'Generate Full AI Summit Event',
    description: 'Auto-create description, 6-stage agenda, FAQs, and Code of Conduct.',
    category: 'Event AI',
    icon: Calendar,
    color: 'amber' as const,
    mode: 'event' as GeneratorMode,
  },
  {
    id: 'p-2',
    title: 'Match Registration Desk Volunteers',
    description: 'Find volunteers with React, QR Scanning, and Registration skills.',
    category: 'Matching',
    icon: UserCheck,
    color: 'indigo' as const,
    mode: 'volunteer' as GeneratorMode,
  },
  {
    id: 'p-3',
    title: 'Draft VIP Speaker Invitation Email',
    description: 'Generate professional keynote invite with formal tone.',
    category: 'Email AI',
    icon: Mail,
    color: 'emerald' as const,
    mode: 'email' as GeneratorMode,
  },
  {
    id: 'p-4',
    title: 'Post Venue Relocation Announcement',
    description: 'Draft instant High-Priority announcement for room/hall change.',
    category: 'Broadcast',
    icon: Megaphone,
    color: 'rose' as const,
    mode: 'announcement' as GeneratorMode,
  },
  {
    id: 'p-5',
    title: 'Create 6-Hour Hackathon Schedule',
    description: 'Build structured timetable with keynote, workshops, and lunch breaks.',
    category: 'Schedule',
    icon: Clock,
    color: 'violet' as const,
    mode: 'schedule' as GeneratorMode,
  },
  {
    id: 'p-6',
    title: 'Build Event Risk & Resource Analysis',
    description: 'Generate expected audience size, volunteer count, and risk mitigations.',
    category: 'Summary',
    icon: FileText,
    color: 'zinc' as const,
    mode: 'summary' as GeneratorMode,
  },
];

export default function AIPromptLibrary({ onSelectPrompt }: AIPromptLibraryProps) {
  const { isDark } = useTheme();

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-semibold ${textPri}`}>Curated Prompt Library</h3>
          <p className={`text-xs mt-0.5 ${textMut}`}>Click any prompt card to run instant 1-click AI generation</p>
        </div>
        <Badge variant="amber">
          <Sparkles className="w-3 h-3 mr-1" /> 6 Ready Templates
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promptCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              onClick={() => onSelectPrompt(card.mode)}
              className={`p-5 rounded-xl border ${cardBg} hover:border-amber-500/40 cursor-pointer transition-all flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <Icon className="w-4 h-4 text-amber-500" />
                  </div>
                  <Badge variant={card.color}>{card.category}</Badge>
                </div>

                <h4 className={`text-xs font-bold mb-1 group-hover:text-amber-500 transition-colors ${textPri}`}>
                  {card.title}
                </h4>
                <p className={`text-xs leading-relaxed line-clamp-2 ${textMut}`}>
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-amber-500 font-semibold">
                <span>Run Prompt</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
