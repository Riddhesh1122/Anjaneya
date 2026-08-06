import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X } from 'lucide-react';
import AIChat from './AIChat';

export default function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-bold text-amber-400 shadow-xl backdrop-blur-md cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Ask AI Copilot</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">Ctrl K</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`relative p-4 rounded-2xl shadow-2xl flex items-center justify-center transition-all cursor-pointer ${
            isOpen
              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 border border-amber-400 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30'
          }`}
          aria-label="Toggle AI Assistant Copilot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-zinc-950 font-black" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-zinc-950" />
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
