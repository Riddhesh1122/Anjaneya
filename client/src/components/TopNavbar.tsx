import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Bell, ChevronDown, User, Settings, LogOut, Cpu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopNavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenAIStudio?: () => void;
  onOpenAIConfig?: () => void;
}

export default function TopNavbar({
  searchQuery = '',
  onSearchChange,
  onOpenAIStudio,
  onOpenAIConfig,
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, text: 'AI matched 3 new volunteers for Hackathon', time: '2 min ago' },
    { id: 2, text: 'Low registration alert: Cyber Security Event', time: '15 min ago' },
    { id: 3, text: 'AI Certificate batch generated successfully', time: '1 hour ago' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* AI Smart Search Bar */}
        <div className="flex-1 max-w-lg ml-12 lg:ml-0">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="AI Smart Search: Try 'AI workshops tomorrow', 'Events in Pune'..."
              className="w-full pl-10 pr-10 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            ) : (
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400/70 animate-pulse pointer-events-none" />
            )}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* LLM Provider Config Button */}
          {onOpenAIConfig && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAIConfig}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-all cursor-pointer"
              title="Configure LLM API Key"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">LLM Settings</span>
            </motion.button>
          )}

          {/* AI Generator Studio Launch Button */}
          {onOpenAIStudio && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAIStudio}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Studio</span>
            </motion.button>
          )}

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-slate-900" />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white">AI Platform Alerts</h3>
                    <span className="text-[10px] text-purple-400 font-medium">3 Unread</span>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0"
                    >
                      <p className="text-xs text-slate-300">{n.text}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs text-slate-300 hidden sm:block font-medium">{user?.name || 'Organizer'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-xs"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="font-semibold text-white">{user?.name || 'Anjaneya Admin'}</p>
                    <p className="text-[11px] text-slate-400">{user?.email || 'admin@anjaneya.ai'}</p>
                  </div>
                  <div className="py-1">
                    {onOpenAIConfig && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenAIConfig();
                        }}
                        className="w-full px-4 py-2 text-left text-purple-300 hover:bg-white/5 flex items-center gap-2"
                      >
                        <Cpu className="w-3.5 h-3.5" /> LLM Settings
                      </button>
                    )}
                    <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-white/5 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Profile & Skills
                    </button>
                    <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-white/5 flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" /> Settings
                    </button>
                    <button onClick={logout} className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" /> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
