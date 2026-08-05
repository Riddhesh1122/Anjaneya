import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Lightbulb,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { AIInsight } from '../../services/aiApi';

interface AIInsightCardProps {
  insight: AIInsight;
  onApplyAction?: (insightId: string) => void;
}

export default function AIInsightCard({ insight, onApplyAction }: AIInsightCardProps) {
  const [applied, setApplied] = useState(false);

  const getBadgeStyle = () => {
    switch (insight.type) {
      case 'warning':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          icon: AlertTriangle,
          label: 'Warning',
        };
      case 'trend':
        return {
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          icon: TrendingUp,
          label: 'Trending',
        };
      case 'optimization':
        return {
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: Zap,
          label: 'Optimization',
        };
      case 'growth':
      default:
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          icon: Lightbulb,
          label: 'Opportunity',
        };
    }
  };

  const badge = getBadgeStyle();
  const Icon = badge.icon;

  const handleApply = () => {
    setApplied(true);
    if (onApplyAction) onApplyAction(insight.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-3xl bg-gradient-to-br from-white/10 via-white/[0.03] to-slate-900 border border-white/10 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Type Badge & Impact */}
        <div className="flex items-center justify-between mb-4">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Impact: <strong className="text-slate-200">{insight.impactScore}</strong>
          </span>
        </div>

        {/* Title & Key Metric */}
        <h4 className="text-base font-bold text-white mb-1">{insight.title}</h4>
        <p className="text-xs font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
          {insight.metric}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">{insight.description}</p>

        {/* Actionable Suggestion */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs mb-4">
          <span className="text-purple-300 font-semibold block mb-1">💡 AI Suggested Action:</span>
          <span className="text-slate-300">{insight.actionableSuggestion}</span>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={handleApply}
        disabled={applied}
        whileTap={{ scale: 0.96 }}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
          applied
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-white/10 hover:bg-purple-500/20 text-white border border-white/10 hover:border-purple-500/40'
        }`}
      >
        {applied ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Recommendation Applied</span>
          </>
        ) : (
          <>
            <span>Execute AI Recommendation</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
