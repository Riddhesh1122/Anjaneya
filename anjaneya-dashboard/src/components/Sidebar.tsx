import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Calendar,
  UserCheck,
  CheckSquare,
  Sparkles,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", label: "Dashboard", icon: LayoutDashboard, highlight: false },
  { key: "events", label: "Events", icon: Calendar, highlight: false },
  { key: "volunteers", label: "Volunteers", icon: UserCheck, highlight: false },
  { key: "tasks", label: "Tasks", icon: CheckSquare, highlight: false },
  { key: "analytics", label: "Analytics & Insights", icon: BarChart3, highlight: false },
  { key: "ai-studio", label: "AI Studio", icon: Sparkles, highlight: true },
  { key: "users", label: "Community", icon: Users, highlight: false },
  { key: "settings", label: "Settings", icon: Settings, highlight: false },
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

  const sidebarContent = (collapsed: boolean, idPrefix: string) => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-2xl bg-brand-gradient font-display text-lg font-bold text-primary-foreground shadow-glow">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="block truncate font-display text-sm font-bold text-foreground">
                Anjaneya
              </span>
              <span className="block truncate text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Event Platform
              </span>
            </div>
          )}
        </div>

        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            className="hidden cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:block"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {onToggleCollapse && collapsed && (
        <button
          onClick={onToggleCollapse}
          title="Expand sidebar"
          className="mx-auto mb-2 hidden cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:block"
        >
          <PanelLeftOpen className="size-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="scrollbar-slim flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {!collapsed && (
          <p className="px-3 pt-2 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Workspace
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex w-full cursor-pointer items-center rounded-xl text-sm font-medium transition-colors duration-200",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`${idPrefix}-active`}
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                />
              )}
              <Icon
                className={cn(
                  "size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary" : item.highlight ? "text-accent" : "",
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.highlight && !isActive && (
                <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI upsell */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl border border-accent/20 bg-accent-soft p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-accent" />
            <p className="text-xs font-semibold text-accent">AI Copilot active</p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Automate scheduling, matching and comms across every event.
          </p>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-border px-3 py-3">
        <button
          onClick={onLogout}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex w-full cursor-pointer items-center rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
          )}
        >
          <LogOut className="size-[18px] shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        className="fixed top-3 left-4 z-50 cursor-pointer rounded-xl border border-border bg-surface p-2 text-muted-foreground shadow-soft lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex",
          isCollapsed ? "w-[76px]" : "w-64",
        )}
      >
        {sidebarContent(isCollapsed, "desktop")}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-sidebar-border bg-sidebar lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
                className="absolute top-5 right-4 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
              {sidebarContent(false, "mobile")}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
