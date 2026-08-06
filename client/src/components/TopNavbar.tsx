import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, User, Settings, LogOut, Cpu,
  ShieldCheck, UserCheck, Calendar, Shield, Sparkles, Sun, Moon,
  CheckCircle2, AlertTriangle, Key
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
  const bg      = isDark ? 'bg-zinc-950/90 border-zinc-800/80' : 'bg-white/90 border-zinc-200/80';
  const text    = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900';
  const btnBg   = isDark ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700';
  const dropBg  = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';

  const notifications = [
    { id: 1, text: 'Matched 3 volunteers for AI Summit', time: '2 min ago', dot: 'bg-amber-500', unread: true },
    { id: 2, text: 'Registration alert: Hackathon event', time: '15 min ago', dot: 'bg-rose-500', unread: true },
    { id: 3, text: 'Certificate batch generated successfully', time: '1 hr ago', dot: 'bg-emerald-500', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const roles = [
    { id: 'attendee',  name: 'Attendee',     icon: Calendar,  color: 'text-amber-500'   },
    { id: 'volunteer', name: 'Volunteer',    icon: UserCheck, color: 'text-emerald-500' },
    { id: 'organizer', name: 'Organizer',    icon: Sparkles,  color: 'text-indigo-400'  },
    { id: 'admin',     name: 'Admin',        icon: Shield,    color: 'text-rose-500'    },
  ];
  const activeRole = roles.find(r => r.id === currentRole) || roles[2];

  return (
    <header className={`sticky top-0 z-30 border-b ${bg} backdrop-blur-xl transition-colors duration-200`}>
      <div className="flex items-center h-16 px-4 lg:px-6 gap-3 sm:gap-4 justify-between">

        {/* Search Input with Shortcut Badge */}
        <div className="flex-1 max-w-md ml-10 lg:ml-0">
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${text}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder="Search events, volunteers, tasks... (Ctrl + K)"
              aria-label="Smart Platform Search"
              className={`w-full pl-10 pr-12 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none focus:border-amber-500/50 ${inputBg}`}
            />
            <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              Ctrl K
            </span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Role Switcher Pill */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${btnBg}`}
            >
              <activeRole.icon className={`w-3.5 h-3.5 ${activeRole.color}`} />
              <span className="hidden md:inline">{activeRole.name} Mode</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            <AnimatePresence>
              {showRoleSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className={`absolute right-0 mt-2 w-44 rounded-xl border ${dropBg} p-1.5 shadow-2xl z-50 space-y-1 text-xs`}
                >
                  <p className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1">Switch Portal Role</p>
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { onRoleChange?.(r.id); setShowRoleSelector(false); }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        currentRole === r.id ? 'bg-amber-500/15 text-amber-400' : `${text} hover:bg-zinc-800/40`
                      }`}
                    >
                      <r.icon className={`w-3.5 h-3.5 ${r.color}`} />
                      {r.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${btnBg}`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </motion.button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border relative transition-all cursor-pointer ${btnBg}`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black flex items-center justify-center border border-zinc-950">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className={`absolute right-0 mt-2 w-80 rounded-2xl border ${dropBg} p-4 shadow-2xl z-50 space-y-3`}
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h4 className={`text-xs font-extrabold ${textPri}`}>Notifications ({unreadCount})</h4>
                    <span className="text-[10px] font-bold text-amber-400">Mark all read</span>
                  </div>

                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl border border-zinc-800 flex items-start gap-2.5 text-xs">
                        <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${n.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${textPri}`}>{n.text}</p>
                          <p className={`text-[10px] ${text}`}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer ${btnBg}`}
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                {(user?.name || 'Aarav').charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className={`absolute right-0 mt-2 w-52 rounded-2xl border ${dropBg} p-2 shadow-2xl z-50 space-y-1 text-xs`}
                >
                  <div className="p-2 border-b border-zinc-800">
                    <p className={`font-bold ${textPri}`}>{user?.name || 'Aarav Sharma'}</p>
                    <p className={`text-[10px] ${text}`}>{user?.email || 'aarav@example.com'}</p>
                  </div>

                  <button
                    onClick={() => setShowDropdown(false)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${text} hover:bg-zinc-800/40`}
                  >
                    <User className="w-4 h-4 text-amber-400" /> My Profile
                  </button>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
