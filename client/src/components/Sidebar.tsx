import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BarChart2,
  Users,
  Settings,
  Calendar,
  UserCheck,
  CheckSquare,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { key: 'home', label: 'Dashboard', icon: Home, highlight: false },
  { key: 'events', label: 'Events', icon: Calendar, highlight: false },
  { key: 'volunteers', label: 'Volunteers', icon: UserCheck, highlight: false },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare, highlight: false },
  { key: 'analytics', label: 'Analytics & AI Insights', icon: BarChart2, highlight: false },
  { key: 'ai-studio', label: 'AI Studio Tools', icon: Sparkles, highlight: true },
  { key: 'users', label: 'Community Users', icon: Users, highlight: false },
  { key: 'settings', label: 'Settings', icon: Settings, highlight: false },
];

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  activeSection,
  onNavigate,
  onLogout,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (key: string) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  const sidebarContent = (collapsedMode: boolean) => (
    <div className="flex flex-col h-full">
      {/* Brand & Collapse Toggle Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/25 flex-shrink-0">
            A
          </div>
          {!collapsedMode && (
            <div className="whitespace-nowrap">
              <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent block">
                Anjaneya
              </span>
              <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase block">
                AI Event Platform
              </span>
            </div>
          )}
        </div>

        {/* Collapse Minimize Desktop Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsedMode ? 'Expand Sidebar' : 'Minimize Sidebar'}
            className="hidden lg:flex p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {collapsedMode ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 mt-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <motion.button
              key={item.key}
              onClick={() => handleNav(item.key)}
              whileHover={{ x: collapsedMode ? 0 : 4 }}
              whileTap={{ scale: 0.97 }}
              title={collapsedMode ? item.label : undefined}
              className={`w-full flex items-center ${
                collapsedMode ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-purple-300 border border-purple-500/30 shadow-md'
                  : item.highlight
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive || item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
              {!collapsedMode && <span className="truncate">{item.label}</span>}
              {isActive && !collapsedMode && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400 flex-shrink-0"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-2.5 pb-5 border-t border-white/5 pt-4">
        <motion.button
          onClick={onLogout}
          whileHover={{ x: collapsedMode ? 0 : 4 }}
          whileTap={{ scale: 0.97 }}
          title={collapsedMode ? 'Logout' : undefined}
          className={`w-full flex items-center ${
            collapsedMode ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          } rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsedMode && <span>Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded-xl bg-slate-800/80 backdrop-blur-sm text-slate-300 hover:text-white border border-white/10"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar with minimize animation */}
      <aside
        className={`hidden lg:flex flex-shrink-0 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 flex-col fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent(isCollapsed)}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-white/10 z-50 flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
