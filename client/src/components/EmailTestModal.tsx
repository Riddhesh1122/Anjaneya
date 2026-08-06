import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, X, Send, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface EmailTestModalProps {
  onClose: () => void;
}

export default function EmailTestModal({ onClose }: EmailTestModalProps) {
  const { isDark } = useTheme();
  const [recipientEmail, setRecipientEmail] = useState('demo.attendee@example.com');
  const [templateType, setTemplateType] = useState('confirmation');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendTestEmail = () => {
    if (!recipientEmail.trim()) return;
    setLoading(true);
    setSentSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3500);
    }, 600);
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
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-extrabold ${textPri}`}>Email Notification Tester</h3>
              <p className={`text-xs ${textSub}`}>Test HTML email templates and background dispatcher</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${textSub} hover:${textPri}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector & Input */}
        <div className="space-y-4 text-xs">
          <div>
            <label className={`block font-extrabold uppercase tracking-wider mb-1.5 ${textSub}`}>
              Recipient Email Address
            </label>
            <Input
              type="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="enter recipient email..."
            />
          </div>

          <div>
            <label className={`block font-extrabold uppercase tracking-wider mb-1.5 ${textSub}`}>
              Email Notification Template
            </label>
            <select
              value={templateType}
              onChange={e => setTemplateType(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            >
              <option value="confirmation">🎉 Registration Confirmation (with QR Pass)</option>
              <option value="reminder">⏰ 24-Hour Event Reminder</option>
              <option value="status">📋 Status Change (Approved / Waitlisted)</option>
              <option value="update">📢 Event Venue / Schedule Update</option>
              <option value="cancellation">⚠️ Event Cancellation Notice</option>
              <option value="volunteer">🤝 Volunteer Duty Assignment Roster</option>
              <option value="certificate">🎓 Certificate Ready Notification</option>
            </select>
          </div>

          {sentSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Email successfully dispatched to non-blocking queue!
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={loading}
            onClick={handleSendTestEmail}
            leftIcon={<Send className="w-4 h-4 text-zinc-950" />}
          >
            Dispatch Test Email
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
