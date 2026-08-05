import { motion } from 'framer-motion';
import { Plus, Sparkles, UserCheck, Download, Megaphone } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface QuickActionsProps {
  onCreateEvent: () => void;
  onAIGenerate: () => void;
  onInviteVolunteer: () => void;
}

export default function QuickActions({ onCreateEvent, onAIGenerate, onInviteVolunteer }: QuickActionsProps) {
  const { isDark } = useTheme();

  const actions = [
    {
      label: 'Create Event',
      icon: Plus,
      onClick: onCreateEvent,
      primary: true,
    },
    {
      label: 'Generate with AI',
      icon: Sparkles,
      onClick: onAIGenerate,
      primary: false,
    },
    {
      label: 'Invite Volunteer',
      icon: UserCheck,
      onClick: onInviteVolunteer,
      primary: false,
    },
    {
      label: 'Export Report',
      icon: Download,
      onClick: () => {},
      primary: false,
    },
    {
      label: 'Announcement',
      icon: Megaphone,
      onClick: () => {},
      primary: false,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              action.primary
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                : isDark
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 shadow-sm'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
}
