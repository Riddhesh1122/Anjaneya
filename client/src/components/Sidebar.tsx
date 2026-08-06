import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BarChart2, Users, Settings, Calendar, UserCheck,
  CheckSquare, Sparkles, LogOut, Menu, X, ChevronLeft, ChevronRight,
  HelpCircle, Bell,
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useTheme } from '../contexts/ThemeContext';

import Logo from './Logo';

/* ── Navigation structure ── */
const NAV_GROUPS = [
  {
    label: 'Main Portal',
    items: [
      { key: 'home',       label: 'Dashboard',   icon: Home       },
      { key: 'events',     label: 'Events',       icon: Calendar   },
      { key: 'volunteers', label: 'Volunteers',   icon: UserCheck  },
      { key: 'tasks',      label: 'Tasks',        icon: CheckSquare },
    ],
  },
  {
    label: 'AI & Copilot',
    items: [
      { key: 'ai-studio',  label: 'AI Studio',   icon: Sparkles   },
      { key: 'analytics',  label: 'Analytics',   icon: BarChart2  },
    ],
  },
  {
    label: 'Platform',
    items: [
      { key: 'users',      label: 'Users',        icon: Users      },
      { key: 'settings',   label: 'Settings',     icon: Settings   },
    ],
  },
];

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeSection, onNavigate, onLogout }: SidebarProps) {
  const { collapsed, toggleSidebar } = useSidebar();
  const { isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (key: string) => { onNavigate(key); setMobileOpen(false); };

  /* ── Color tokens ── */
  const bg       = isDark ? 'bg-zinc-950'    : 'bg-white';
  const border   = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const text     = isDark ? 'text-zinc-300'  : 'text-zinc-700';
  const textAct  = isDark ? 'text-white'      : 'text-zinc-950';
  const hoverBg  = isDark ? 'hover:bg-zinc-900' : 'hover:bg-zinc-100';
  const activeBg = isDark ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-zinc-100 text-zinc-950 border border-zinc-200';
  const divider  = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const groupLbl = isDark ? 'text-zinc-400' : 'text-zinc-500';

  /* ── Inner content (shared desktop + mobile) ── */
  const content = (forceExpanded = false) => {
    const isCollapsed = collapsed && !forceExpanded;
    return (
      <div className="flex flex-col h-full">

        {/* Brand header */}
        <div className={`flex items-center justify-between border-b ${border} h-16 px-4 flex-shrink-0`}>
          <Logo size="md" showText={!isCollapsed} />
          {/* Desktop collapse toggle */}
          {!forceExpanded && (
            <button
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expand' : 'Collapse'}
              className={`hidden lg:flex p-1.5 rounded-lg transition-colors cursor-pointer ${hoverBg} ${text} hover:${textAct}`}
            >
              {isCollapsed
                ? <ChevronRight className="w-4 h-4" />
                : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className={`text-xs font-bold uppercase tracking-wider px-2 mb-2 ${groupLbl}`}>
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <motion.button
                      key={item.key}
                      onClick={() => handleNav(item.key)}
                      whileTap={{ scale: 0.98 }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
                      } rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive ? activeBg : `${text} ${hoverBg}`
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-500' : ''}`} />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Help + Logout footer */}
        <div className={`border-t ${divider} px-3 py-4 space-y-1 flex-shrink-0`}>
          <button
            title={isCollapsed ? 'Help' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
            } rounded-xl text-sm font-semibold transition-colors cursor-pointer ${text} ${hoverBg}`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Help & Support</span>}
          </button>

          <button
            onClick={onLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
            } rounded-xl text-sm font-bold transition-colors cursor-pointer text-rose-500 hover:bg-rose-500/10`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          border-r ${border} ${bg}
          h-screen sticky top-0
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[64px]' : 'w-[250px]'}
        `}
      >
        {content()}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className={`lg:hidden fixed inset-y-0 left-0 w-[250px] z-50 flex flex-col border-r ${border} ${bg}`}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-md text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
