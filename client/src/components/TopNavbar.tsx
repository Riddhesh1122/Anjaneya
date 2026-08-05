import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, User, Settings, LogOut, Cpu,
  ShieldCheck, UserCheck, Calendar, Shield, Sparkles, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface TopNavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenAIStudio?: () => void;
  onOpenAIConfig?: () => void;
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

export default function TopNavbar({
  searchQuery = '',
  onSearchChange,
  onOpenAIStudio,
  onOpenAIConfig,
  currentRole = 'organizer',
  onRoleChange,
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoleSelector(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* ── Color tokens ── */
  const bg      = isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-zinc-200';
  const text    = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-900 border-zinc-800 placeholder-zinc-600 text-zinc-300' : 'bg-zinc-100 border-zinc-200 placeholder-zinc-400 text-zinc-700';
  const btnBg   = isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-800';
  const dropBg  = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-lg';
  const dropHov = isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50';

  const notifications = [
    { id: 1, text: 'AI matched 3 volunteers for Hackathon', time: '2 min ago', dot: 'bg-amber-500' },
    { id: 2, text: 'Low registration: Cyber Security Event', time: '15 min ago', dot: 'bg-rose-500' },
    { id: 3, text: 'AI certificate batch generated', time: '1 hr ago', dot: 'bg-emerald-500' },
  ];

  const roles = [
    { id: 'attendee',  name: 'Attendee',     icon: Calendar,  color: 'text-amber-500'   },
    { id: 'volunteer', name: 'Volunteer',    icon: UserCheck, color: 'text-emerald-500' },
    { id: 'organizer', name: 'Organizer',    icon: Sparkles,  color: 'text-indigo-400'  },
    { id: 'admin',     name: 'Admin',        icon: Shield,    color: 'text-rose-500'    },
  ];
  const activeRole = roles.find(r => r.id === currentRole) || roles[2];

  return (
    <header className={`sticky top-0 z-30 border-b ${bg} backdrop-blur-xl`}>
      <div className="flex items-center h-14 px-4 lg:px-6 gap-3">

        {/* Search */}
        <div className="flex-1 max-w-md ml-10 lg:ml-0">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${text}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder="Search events, volunteers… (AI-powered)"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 ${inputBg}`}
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 ml-auto">

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${btnBg}`}
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun className="w-3.5 h-3.5" />
              : <Moon className="w-3.5 h-3.5" />}
          </motion.button>

          {/* Role Switcher */}
          <div className="relative" ref={roleRef}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${btnBg}`}
            >
              <activeRole.icon className={`w-3.5 h-3.5 ${activeRole.color}`} />
              <span className="hidden sm:inline">{activeRole.name}</span>
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            <AnimatePresence>
              {showRoleSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-1.5 w-44 rounded-xl border overflow-hidden z-50 ${dropBg}`}
                >
                  <div className={`px-3 py-2 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'} text-[10px] uppercase tracking-wider ${text} font-semibold`}>
                    Switch Role
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { onRoleChange?.(r.id); setShowRoleSelector(false); }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${dropHov} ${
                        currentRole === r.id ? textPri + ' font-semibold' : text
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <r.icon className={`w-3.5 h-3.5 ${r.color}`} />
                        {r.name}
                      </div>
                      {currentRole === r.id && <ShieldCheck className="w-3 h-3 text-amber-500" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LLM Config */}
          {onOpenAIConfig && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAIConfig}
              title="LLM Settings"
              className={`hidden sm:flex p-2 rounded-lg border transition-all cursor-pointer ${btnBg}`}
            >
              <Cpu className="w-3.5 h-3.5" />
            </motion.button>
          )}

          {/* AI Studio */}
          {onOpenAIStudio && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAIStudio}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Studio
            </motion.button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg border transition-all cursor-pointer ${btnBg}`}
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-1.5 w-76 rounded-xl border overflow-hidden z-50 ${dropBg}`}
                  style={{ width: '300px' }}
                >
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'} flex justify-between items-center`}>
                    <span className={`text-xs font-semibold ${textPri}`}>Notifications</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">3 new</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 flex items-start gap-3 border-b ${isDark ? 'border-zinc-800/60' : 'border-zinc-100'} last:border-0 ${dropHov} cursor-pointer transition-colors`}>
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                      <div>
                        <p className={`text-xs ${textPri}`}>{n.text}</p>
                        <p className={`text-[11px] mt-0.5 ${text}`}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg border transition-all cursor-pointer ${btnBg}`}
            >
              <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-zinc-950 text-xs font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-1.5 w-52 rounded-xl border overflow-hidden z-50 ${dropBg}`}
                >
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <p className={`text-xs font-semibold ${textPri}`}>{user?.name || 'Anjaneya Lead'}</p>
                    <p className={`text-[11px] mt-0.5 ${text}`}>{user?.email || 'organizer@anjaneya.ai'}</p>
                  </div>
                  <div className="py-1">
                    {onOpenAIConfig && (
                      <button onClick={() => { setShowDropdown(false); onOpenAIConfig(); }}
                        className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 transition-colors ${dropHov} ${text}`}>
                        <Cpu className="w-3.5 h-3.5" /> LLM Settings
                      </button>
                    )}
                    <button className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 transition-colors ${dropHov} ${text}`}>
                      <User className="w-3.5 h-3.5" /> Profile & Skills
                    </button>
                    <button className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 transition-colors ${dropHov} ${text}`}>
                      <Settings className="w-3.5 h-3.5" /> Settings
                    </button>
                    <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'} mt-1 pt-1`}>
                      <button onClick={logout} className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2 text-rose-500 hover:bg-rose-500/10 transition-colors`}>
                        <LogOut className="w-3.5 h-3.5" /> Sign out
                      </button>
                    </div>
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
