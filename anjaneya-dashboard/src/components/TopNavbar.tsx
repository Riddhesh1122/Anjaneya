import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Cpu,
  Sparkles,
  Sun,
  Moon,
  Command,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { StatusBadge } from "@/components/ui/primitives";

interface TopNavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenAIStudio?: () => void;
  onOpenAIConfig?: () => void;
  onNavigate?: (section: string) => void;
}

export default function TopNavbar({
  searchQuery = "",
  onSearchChange,
  onOpenAIStudio,
  onOpenAIConfig,
  onNavigate,
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifications = [
    { id: 1, text: "AI matched 3 new volunteers for Hackathon", time: "2 min ago", tone: "accent" },
    { id: 2, text: "Low registration alert: Cyber Security Event", time: "15 min ago", tone: "warning" },
    { id: 3, text: "AI Certificate batch generated successfully", time: "1 hour ago", tone: "success" },
  ] as const;

  const initials = (user?.name || "Organizer")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 lg:px-8">
        {/* Search */}
        <div className="ml-11 min-w-0 flex-1 lg:ml-0 lg:max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search events, volunteers, tasks…"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pr-16 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
            <span className="absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:flex">
              <Command className="size-3" />K
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenAIStudio}
            className="hidden cursor-pointer items-center gap-2 rounded-xl bg-brand-gradient px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-105 md:inline-flex"
          >
            <Sparkles className="size-4" />
            Ask AI
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="cursor-pointer rounded-xl border border-border bg-surface p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              aria-label="Notifications"
              className="relative cursor-pointer rounded-xl border border-border bg-surface p-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-surface" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="glass-strong absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border shadow-lift"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    <StatusBadge tone="primary">3 new</StatusBadge>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="cursor-pointer border-b border-border px-4 py-3 last:border-0 hover:bg-muted"
                      >
                        <p className="text-xs leading-relaxed text-foreground">{n.text}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface py-1.5 pr-2 pl-1.5 transition-colors hover:bg-muted"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-gradient text-[11px] font-bold text-primary-foreground">
                {initials}
              </span>
              <span className="hidden max-w-28 truncate text-xs font-semibold text-foreground sm:block">
                {user?.name || "Organizer"}
              </span>
              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="glass-strong absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-border shadow-lift"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.name || "Organizer"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email || "organizer@anjaneya.io"}
                    </p>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: "Profile", icon: User, action: () => onNavigate?.("users") },
                      { label: "Settings", icon: Settings, action: () => onNavigate?.("settings") },
                      { label: "AI provider", icon: Cpu, action: () => onOpenAIConfig?.() },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.action();
                          setShowDropdown(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={logout}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive-soft"
                    >
                      <LogOut className="size-4" />
                      Log out
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
