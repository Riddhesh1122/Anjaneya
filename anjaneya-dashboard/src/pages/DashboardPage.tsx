import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  UserCheck,
  CheckSquare,
  Users2,
  Award,
  Mail,
  HelpCircle,
  FileText,
  Cpu,
  BarChart3,
  Clock,
  Search,
  ShieldCheck,
  Bell,
  Palette,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import StatCard from "@/components/StatCard";
import ActivityTable from "@/components/ActivityTable";
import ChartSection from "@/components/ChartSection";
import HeroOverview from "@/components/dashboard/HeroOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import UpcomingEvents, { type EventItem } from "@/components/dashboard/UpcomingEvents";
import VolunteerOverview from "@/components/dashboard/VolunteerOverview";
import EventWizard from "@/components/dashboard/EventWizard";
import {
  Panel,
  SectionHeading,
  StatusBadge,
  statusTone,
  Button,
  AIActionButton,
  CardSkeleton,
  Skeleton,
} from "@/components/ui/primitives";

// AI Components
import FloatingAIButton from "@/components/ai/FloatingAIButton";
import AIRecommendationCard from "@/components/ai/AIRecommendationCard";
import AIInsightCard from "@/components/ai/AIInsightCard";
import AIGeneratorModal, { type GeneratorMode } from "@/components/ai/AIGeneratorModal";
import AIConfigModal from "@/components/ai/AIConfigModal";

// AI Service API
import {
  getEventRecommendations,
  generateAIAnalyticsInsights,
  smartSearchEvents,
  getAIConfig,
  type RecommendedEvent,
  type AIInsight,
  type EventGeneratedData,
} from "@/services/aiApi";

const initialEvents: EventItem[] = [
  {
    id: "ev-1",
    title: "AI & ML Innovations Summit 2026",
    category: "Artificial Intelligence",
    date: "Today, Aug 4",
    location: "Pune Tech Park / Hybrid",
    attendees: 420,
    description:
      "Explore state-of-the-art LLMs, autonomous agents, and production deployment strategies.",
    isToday: true,
    price: 0,
    isFree: true,
    needsVolunteers: true,
  },
  {
    id: "ev-2",
    title: "Global Hackathon & Code Sprint",
    category: "Hackathons",
    date: "Aug 6 - Aug 8",
    location: "Main Tech Hub, Stage A",
    attendees: 280,
    description:
      "48-hour buildathon with $25,000 in prizes across AI, Sustainability, and Web3 tracks.",
    isToday: false,
    price: 0,
    isFree: true,
    needsVolunteers: true,
  },
  {
    id: "ev-3",
    title: "Cyber Security & Zero Trust Workshop",
    category: "Cyber Security",
    date: "Aug 14",
    location: "Convention Center Lab 2",
    attendees: 115,
    description: "Hands-on CTF challenges and serverless security architecture session.",
    isToday: false,
    price: 25,
    isFree: false,
    needsVolunteers: false,
  },
];

const tasks = [
  { task: "Check-in Desk Leader", event: "AI & ML Innovations Summit", time: "Today, 9:30 AM", priority: "High" },
  { task: "AV & Projection Setup", event: "Global Hackathon", time: "Aug 6, 1:00 PM", priority: "Medium" },
  { task: "Web Development Mentor", event: "Community Code Sprint", time: "Aug 8, 3:00 PM", priority: "High" },
  { task: "Judging Panel Coordination", event: "Global Hackathon", time: "Aug 8, 6:00 PM", priority: "Medium" },
];

const communityUsers = [
  { name: "Alice Johnson", role: "Admin", status: "Active", events: 24 },
  { name: "Bob Smith", role: "Developer", status: "Active", events: 12 },
  { name: "Carol Davis", role: "Designer", status: "Away", events: 8 },
  { name: "Dev Kapoor", role: "Volunteer Lead", status: "Active", events: 31 },
  { name: "Elena Ruiz", role: "Sponsor Manager", status: "Pending", events: 4 },
  { name: "Farhan Ali", role: "Community Mod", status: "Active", events: 17 },
];

const aiTools: { id: GeneratorMode; title: string; desc: string; icon: LucideIcon }[] = [
  { id: "event", title: "AI Event Description Generator", desc: "Generate complete agenda, rules, FAQs & code of conduct.", icon: FileText },
  { id: "volunteer", title: "AI Volunteer Allocator", desc: "Match volunteers based on skills, availability & experience.", icon: UserCheck },
  { id: "certificate", title: "AI Certificate Writer", desc: "Auto-write appreciation text for volunteers and participants.", icon: Award },
  { id: "email", title: "AI Email Generator", desc: "Draft confirmations, reminders, invitations & thank you emails.", icon: Mail },
  { id: "faq", title: "AI Smart FAQ Generator", desc: "Build instant structured FAQ pairs from event details.", icon: HelpCircle },
];

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

export default function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [generatorModalMode, setGeneratorModalMode] = useState<GeneratorMode | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [recommendations, setRecommendations] = useState<RecommendedEvent[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [createdEvents, setCreatedEvents] = useState<EventItem[]>([]);

  // Load AI Data on mount
  useEffect(() => {
    getEventRecommendations().then(setRecommendations);
    generateAIAnalyticsInsights().then(setInsights);
    setFilteredEvents(initialEvents);
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Handle Natural Language Smart Search
  useEffect(() => {
    const all = [...createdEvents, ...initialEvents];
    smartSearchEvents(searchQuery, all).then((res) => setFilteredEvents(res as EventItem[]));
  }, [searchQuery, createdEvents]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleSaveGeneratedEvent = (data: EventGeneratedData) => {
    const newEvent: EventItem = {
      id: `ev-${Date.now()}`,
      title: "AI Generated Event Draft",
      category: "AI Generated",
      date: "Aug 20, 2026",
      location: "Innovation Center",
      attendees: 1,
      description: data.description,
      isToday: false,
      price: 0,
      isFree: true,
      needsVolunteers: true,
    };
    setCreatedEvents((prev) => [newEvent, ...prev]);
  };

  const handleWizardSubmit = (values: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    price: string;
  }) => {
    const priceNum = Number(values.price) || 0;
    const formattedDate = values.date
      ? new Date(`${values.date}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date TBD";
    const newEvent: EventItem = {
      id: `ev-${Date.now()}`,
      title: values.title,
      category: "Custom Event",
      date: formattedDate,
      location: values.location,
      attendees: 1,
      description: values.description,
      isToday: false,
      price: priceNum,
      isFree: priceNum === 0,
      needsVolunteers: true,
    };
    setCreatedEvents((prev) => [newEvent, ...prev]);
  };

  /** Every ✨ AI action across the app routes into the AI studio modal. */
  const runAIAction = (label: string) => {
    const map: Record<string, GeneratorMode> = {
      "Optimize Event": "event",
      "Generate Schedule": "event",
      "Assign Volunteers": "volunteer",
      "Summarize Feedback": "email",
      "Predict Attendance": "event",
    };
    setGeneratorModalMode(map[label] ?? "event");
  };

  const stats = useMemo(
    () => [
      { title: "Total registrations", value: 24563, icon: <Users2 className="size-5" />, trend: "+12.5%", trendUp: true, tone: "primary" as const, caption: "vs. last quarter", spark: [8, 12, 10, 16, 14, 20, 24] },
      { title: "Active events", value: 48, icon: <Calendar className="size-5" />, trend: "+18.2%", trendUp: true, tone: "success" as const, caption: "6 running today", spark: [4, 6, 5, 9, 8, 11, 12] },
      { title: "Matched volunteers", value: 1847, icon: <UserCheck className="size-5" />, trend: "+23.1%", trendUp: true, tone: "accent" as const, caption: "92% coverage", spark: [10, 9, 13, 12, 17, 19, 22] },
      { title: "AI accuracy rating", value: "98.4%", icon: <Sparkles className="size-5" />, trend: "+4.3%", trendUp: true, tone: "warning" as const, caption: "across 231 runs", spark: [14, 15, 15, 17, 18, 18, 20] },
    ],
    [],
  );

  /* ------------------------------ Sections ------------------------------ */

  const renderHome = () => (
    <motion.div key="home" {...fade} className="space-y-6">
      <HeroOverview
        name={user?.name || "Organizer"}
        onCreateEvent={() => setGeneratorModalMode("event")}
        onAIAction={runAIAction}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : stats.map((stat, i) => <StatCard key={stat.title} {...stat} delay={i * 0.06} />)}
      </div>

      <ChartSection onAIAction={runAIAction} />

      {/* AI insights */}
      <Panel className="p-5 sm:p-6">
        <SectionHeading
          title="AI insights"
          subtitle="Opportunities detected across your workspace"
          icon={<Sparkles className="size-4" />}
          actions={
            <Button variant="soft" size="sm" onClick={() => setActiveSection("analytics")}>
              View all
            </Button>
          }
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {insights.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <Panel key={i} className="p-5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-3 h-3 w-full" />
                  <Skeleton className="mt-2 h-3 w-4/5" />
                </Panel>
              ))
            : insights.slice(0, 3).map((ins) => <AIInsightCard key={ins.id} insight={ins} />)}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <UpcomingEvents
            events={[...createdEvents, ...filteredEvents].slice(0, 3)}
            loading={isLoading}
            onAIAction={runAIAction}
          />
        </div>
        <QuickActions onAction={(mode) => setGeneratorModalMode(mode as GeneratorMode)} />
      </div>

      <VolunteerOverview loading={isLoading} onAIAction={runAIAction} compact />

      {/* Recommended for you */}
      <Panel className="p-5 sm:p-6">
        <SectionHeading
          title="Recommended for you"
          subtitle="Personalised by AI from your organising history"
          icon={<Sparkles className="size-4" />}
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((event) => (
            <AIRecommendationCard key={event.id} event={event} />
          ))}
        </div>
      </Panel>

      <ActivityTable loading={isLoading} onAIAction={runAIAction} />
    </motion.div>
  );

  const renderEvents = () => (
    <motion.div key="events" {...fade} className="space-y-6">
      <SectionHeading
        title="Events"
        subtitle="Everything you are organising this season"
        actions={
          <Button variant="primary" size="sm" onClick={() => setGeneratorModalMode("event")}>
            <Sparkles className="size-4" />
            Create with AI
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <UpcomingEvents
            events={[...createdEvents, ...filteredEvents]}
            loading={isLoading}
            onAIAction={runAIAction}
          />
        </div>
        <EventWizard
          onLaunchAI={() => setGeneratorModalMode("event")}
          onSubmitted={handleWizardSubmit}
        />
      </div>
    </motion.div>
  );

  const renderVolunteers = () => (
    <motion.div key="volunteers" {...fade} className="space-y-6">
      <SectionHeading
        title="Volunteers"
        subtitle="Skill-matched crew across all live events"
        actions={<AIActionButton size="md" label="Assign Volunteers" onClick={() => runAIAction("Assign Volunteers")} />}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total volunteers", value: 1847, icon: <UserCheck className="size-5" />, tone: "primary" as const, caption: "across 48 events" },
          { title: "Confirmed today", value: 126, icon: <CheckSquare className="size-5" />, tone: "success" as const, caption: "6 shifts running" },
          { title: "Awaiting response", value: 34, icon: <Clock className="size-5" />, tone: "warning" as const, caption: "reminder queued" },
          { title: "AI match quality", value: "94%", icon: <Sparkles className="size-5" />, tone: "accent" as const, caption: "skills vs. role fit" },
        ].map((s, i) => (
          <StatCard key={s.title} {...s} delay={i * 0.05} />
        ))}
      </div>
      <VolunteerOverview loading={isLoading} onAIAction={runAIAction} />
    </motion.div>
  );

  const renderTasks = () => (
    <motion.div key="tasks" {...fade} className="space-y-6">
      <SectionHeading
        title="Your tasks"
        subtitle="Assignments generated from your event schedule"
        actions={<AIActionButton size="md" label="Generate Schedule" onClick={() => runAIAction("Generate Schedule")} />}
      />
      <Panel className="divide-y divide-border overflow-hidden">
        {tasks.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 transition-colors hover:bg-muted/60 sm:p-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <CheckSquare className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{t.task}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.event} • {t.time}
                </p>
              </div>
            </div>
            <StatusBadge tone={statusTone(t.priority)} dot>
              {t.priority}
            </StatusBadge>
          </motion.div>
        ))}
      </Panel>
    </motion.div>
  );

  const renderAnalytics = () => (
    <motion.div key="analytics" {...fade} className="space-y-6">
      <SectionHeading
        title="Analytics & AI insights"
        subtitle="Real-time platform performance and recommendations"
        icon={<BarChart3 className="size-4" />}
        actions={<AIActionButton size="md" label="Predict Attendance" onClick={() => runAIAction("Predict Attendance")} />}
      />
      <ChartSection onAIAction={runAIAction} />
      <Panel className="p-5 sm:p-6">
        <SectionHeading
          title="Optimisation opportunities"
          subtitle="Ranked by projected impact"
          icon={<Sparkles className="size-4" />}
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((ins) => (
            <AIInsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </Panel>
    </motion.div>
  );

  const renderAIStudio = () => (
    <motion.div key="ai-studio" {...fade} className="space-y-6">
      <SectionHeading
        title="Anjaneya AI Studio"
        subtitle="Select a tool to generate content automatically"
        icon={<Sparkles className="size-4" />}
        actions={
          <Button variant="soft" size="sm" onClick={() => setShowConfigModal(true)} icon={<Cpu className="size-4" />}>
            Configure provider
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {aiTools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setGeneratorModalMode(tool.id)}
            className="card-lift group flex cursor-pointer flex-col justify-between rounded-3xl border border-border bg-card p-6 text-left shadow-card"
          >
            <div>
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-glow transition-transform duration-200 group-hover:scale-105">
                <tool.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{tool.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tool.desc}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              Launch tool <Sparkles className="size-3.5" />
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div key="users" {...fade} className="space-y-6">
      <SectionHeading title="Community" subtitle="People collaborating in your workspace" icon={<Users2 className="size-4" />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {communityUsers.map((u, i) => (
          <motion.div
            key={u.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card-lift rounded-3xl border border-border bg-card p-5 shadow-card"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-xs font-bold text-primary">
                  {u.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.role}</p>
                </div>
              </div>
              <StatusBadge tone={statusTone(u.status)} dot>
                {u.status}
              </StatusBadge>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">{u.events} events organised</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderSettings = () => {
    const currentConfig = getAIConfig();
    return (
      <motion.div key="settings" {...fade} className="max-w-3xl space-y-6">
        <SectionHeading title="Settings" subtitle="Workspace, AI provider and appearance" />

        <Panel className="p-5 sm:p-6">
          <SectionHeading
            title="AI provider"
            subtitle={`Model: ${currentConfig.model}`}
            icon={<Cpu className="size-4" />}
            actions={
              <Button variant="soft" size="sm" onClick={() => setShowConfigModal(true)}>
                Change
              </Button>
            }
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge tone="accent">{currentConfig.provider.toUpperCase()}</StatusBadge>
            <StatusBadge tone="success" dot>
              Connected
            </StatusBadge>
          </div>
        </Panel>

        <Panel className="divide-y divide-border">
          {[
            { label: "Dark mode", desc: "Switch between light and dark interface", icon: Palette, control: (
              <button
                onClick={toggleTheme}
                role="switch"
                aria-checked={theme === "dark"}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-surface shadow-soft transition-all ${theme === "dark" ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
            ) },
            { label: "Email notifications", desc: "Digest of registrations and volunteer changes", icon: Bell, control: <StatusBadge tone="success">On</StatusBadge> },
            { label: "Two-factor auth", desc: "Extra security for organiser accounts", icon: ShieldCheck, control: <StatusBadge tone="warning">Recommended</StatusBadge> },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <row.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{row.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{row.desc}</p>
                </div>
              </div>
              <div className="shrink-0">{row.control}</div>
            </div>
          ))}
        </Panel>
      </motion.div>
    );
  };

  const sectionRenderers: Record<string, () => React.ReactElement> = {
    home: renderHome,
    events: renderEvents,
    volunteers: renderVolunteers,
    tasks: renderTasks,
    analytics: renderAnalytics,
    "ai-studio": renderAIStudio,
    users: renderUsers,
    settings: renderSettings,
  };

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300 ${
          isSidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-64"
        }`}
      >
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAIStudio={() => setGeneratorModalMode("event")}
          onOpenAIConfig={() => setShowConfigModal(true)}
          onNavigate={setActiveSection}
        />

        {searchQuery && activeSection !== "events" && (
          <div className="border-b border-border bg-surface-muted px-4 py-2 text-xs text-muted-foreground lg:px-8">
            <span className="inline-flex items-center gap-1.5">
              <Search className="size-3.5" />
              Smart search active — {filteredEvents.length} matching events
            </span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">{sectionRenderers[activeSection]?.()}</AnimatePresence>
        </main>
      </div>

      <FloatingAIButton />

      <AnimatePresence>
        {generatorModalMode && (
          <AIGeneratorModal
            initialMode={generatorModalMode}
            onClose={() => setGeneratorModalMode(null)}
            onSaveEventData={handleSaveGeneratedEvent}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfigModal && <AIConfigModal onClose={() => setShowConfigModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
