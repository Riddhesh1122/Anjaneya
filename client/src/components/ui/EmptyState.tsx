import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-xl border border-dashed flex flex-col items-center justify-center text-center ${
        isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-300'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 ${
        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
      }`}>
        {icon || <Inbox className="w-6 h-6" />}
      </div>

      <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
        {title}
      </h4>

      <p className={`text-xs max-w-sm mb-5 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-2">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
