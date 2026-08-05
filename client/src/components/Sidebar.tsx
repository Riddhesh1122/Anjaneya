import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BarChart2, Users, Settings, Calendar, UserCheck,
  CheckSquare, Sparkles, LogOut, Menu, X, ChevronLeft, ChevronRight,
  HelpCircle, Bell,
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useTheme } from '../contexts/ThemeContext';

/* ── Navigation structure ── */
const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { key: 'home',       label: 'Dashboard',   icon: Home       },
      { key: 'events',     label: 'Events',       icon: Calendar   },
      { key: 'volunteers', label: 'Volunteers',   icon: UserCheck  },
      { key: 'tasks',      label: 'Tasks',        icon: CheckSquare },
    ],
  },
  {
    label: 'AI & Data',
    items: [
      { key: 'ai-studio',  label: 'AI Studio',   icon: Sparkles   },
      { key: 'analytics',  label: 'Analytics',   icon: BarChart2  },
    ],
  },
  {
    label: 'Settings',
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
  const text     = isDark ? 'text-zinc-400'  : 'text-zinc-500';
  const textAct  = isDark ? 'text-zinc-100'  : 'text-zinc-900';
  const hoverBg  = isDark ? 'hover:bg-zinc-900' : 'hover:bg-zinc-100';
  const activeBg = isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-100 text-zinc-900';
  const divider  = isDark ? 'border-zinc-800/60' : 'border-zinc-100';
  const groupLbl = isDark ? 'text-zinc-600' : 'text-zinc-400';

  /* ── Inner content (shared desktop + mobile) ── */
  const content = (forceExpanded = false) => {
    const isCollapsed = collapsed && !forceExpanded;
    return (
      <div className="flex flex-col h-full">

        {/* Brand header */}
        <div className={`flex items-center border-b ${border} h-14 px-4 gap-3 flex-shrink-0`}>
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm flex-shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${textAct}`}>Anjaneya</p>
              <p className={`text-[10px] truncate ${text}`}>Event & Volunteer AI</p>
            </div>
          )}
          {/* Desktop collapse toggle */}
          {!forceExpanded && (
            <button
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expand' : 'Collapse'}
              className={`hidden lg:flex p-1.5 rounded-md transition-colors cursor-pointer ${hoverBg} ${text} hover:${textAct}`}
            >
              {isCollapsed
                ? <ChevronRight className="w-3.5 h-3.5" />
                : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className={`text-[10px] font-semibold uppercase tracking-wider px-2 mb-1 ${groupLbl}`}>
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
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
                        isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-2 py-2'
                      } rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive ? activeBg : `${text} ${hoverBg}`
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-500' : ''}`} />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Help + Logout footer */}
        <div className={`border-t ${divider} px-2 py-3 space-y-0.5 flex-shrink-0`}>
          <button
            title={isCollapsed ? 'Help' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-2 py-2'
            } rounded-lg text-xs font-medium transition-colors cursor-pointer ${text} ${hoverBg}`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Help & Support</span>}
          </button>

          <button
            onClick={onLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-2 py-2'
            } rounded-lg text-xs font-medium transition-colors cursor-pointer text-rose-500 hover:bg-rose-500/10`}
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
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400"
        aria-label="Open sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          border-r ${border} ${bg}
          h-screen sticky top-0
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[60px]' : 'w-[240px]'}
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
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className={`lg:hidden fixed inset-y-0 left-0 w-[240px] z-50 flex flex-col border-r ${border} ${bg}`}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-md text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
