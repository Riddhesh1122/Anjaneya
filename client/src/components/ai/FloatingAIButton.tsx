import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X } from 'lucide-react';
import AIChat from './AIChat';

export default function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-xs font-medium text-purple-200 shadow-xl backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Ask Anjaneya AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`relative p-4 rounded-2xl shadow-2xl flex items-center justify-center transition-all cursor-pointer ${
            isOpen
              ? 'bg-slate-800 text-slate-300 border border-white/10'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border border-purple-400/30 ring-4 ring-purple-500/20'
          }`}
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* AIChat Drawer/Modal */}
      <AnimatePresence>
        {isOpen && (
          <AIChat onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
