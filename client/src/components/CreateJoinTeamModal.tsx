import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, X, Plus, Key, CheckCircle2, AlertTriangle, Copy } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface CreateJoinTeamModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateJoinTeamModal({ onClose, onSuccess }: CreateJoinTeamModalProps) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  
  // Form State
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const [inviteCode, setInviteCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      setFeedback({ type: 'error', msg: 'Please provide a team name' });
      return;
    }
    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setLoading(false);
      setFeedback({ type: 'success', msg: 'Team created successfully! Your invite code is TEAM-X9P2.' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    }, 500);
  };

  const handleJoinTeam = () => {
    if (!inviteCode.trim()) {
      setFeedback({ type: 'error', msg: 'Please enter a valid invite code' });
      return;
    }
    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setLoading(false);
      setFeedback({ type: 'success', msg: 'Successfully joined team!' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    }, 500);
  };

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-2xl';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-lg rounded-2xl border ${cardBg} p-6 space-y-5 overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-extrabold ${textPri}`}>Team Registration Hub</h3>
              <p className={`text-xs ${textSub}`}>Create a new team or join with an invite code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textSub} hover:${textPri}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-zinc-800/40 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => { setActiveTab('create'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
            }`}
          >
            Create New Team
          </button>
          <button
            onClick={() => { setActiveTab('join'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'join' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
            }`}
          >
            Join via Invite Code
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {feedback.msg}
          </motion.div>
        )}

        {/* Create Form */}
        {activeTab === 'create' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>
                Team Name
              </label>
              <Input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. CyberShield Innovators"
              />
            </div>

            <div>
              <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>
                Team Description (Optional)
              </label>
              <Input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. AI & Security Research Team"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>
                  Min Team Size
                </label>
                <Input
                  type="number"
                  value={minTeamSize}
                  onChange={e => setMinTeamSize(Number(e.target.value))}
                  min={2}
                  max={10}
                />
              </div>
              <div>
                <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>
                  Max Team Size
                </label>
                <Input
                  type="number"
                  value={maxTeamSize}
                  onChange={e => setMaxTeamSize(Number(e.target.value))}
                  min={2}
                  max={10}
                />
              </div>
            </div>
          </div>
        )}

        {/* Join Form */}
        {activeTab === 'join' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className={`block font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>
                Invite Code
              </label>
              <Input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. TEAM-X9P2"
                className="font-mono tracking-widest text-center uppercase font-bold text-sm"
              />
              <p className={`text-[10px] mt-1 ${textSub}`}>
                Ask your Team Leader for the 6-character invite code (e.g., TEAM-X9P2).
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === 'create' ? (
            <Button
              variant="primary"
              size="sm"
              isLoading={loading}
              onClick={handleCreateTeam}
              leftIcon={<Plus className="w-4 h-4 text-zinc-950" />}
            >
              Create Team
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              isLoading={loading}
              onClick={handleJoinTeam}
              leftIcon={<Key className="w-4 h-4 text-zinc-950" />}
            >
              Join Team
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
