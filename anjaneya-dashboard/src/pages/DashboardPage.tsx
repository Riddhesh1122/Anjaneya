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
  Ticket,
  ClipboardCheck,
  QrCode,
  LogIn,
  LogOut as LogOutIcon,
  UserMinus,
  Plus,
  X,
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

// Backend service (event-management-hackathon). Every call fails soft, so
// when the backend/MongoDB is unreachable the dashboard keeps working in
// its original local/demo mode.
import {
  getEvents as fetchBackendEvents,
  mapBackendEventToItem,
  createEvent as createBackendEvent,
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getRegistrationQr,
  getTasks as fetchTasks,
  createTask as createBackendTask,
  assignTask as assignBackendTask,
  updateTaskStatus as updateBackendTaskStatus,
  deleteTask as deleteBackendTask,
  getEventAttendance,
  checkInRegistration,
  checkOutRegistration,
  getDashboardStats,
  type BackendRegistration,
  type BackendTask,
  type AttendanceSummary,
  type DashboardStats,
} from "@/services/backendApi";

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

  // Events sourced from the real backend (falls back to the local
  // `initialEvents` demo list below when the backend is unreachable).
  const [backendEvents, setBackendEvents] = useState<EventItem[] | null>(null);
  const baseEvents = backendEvents && backendEvents.length > 0 ? backendEvents : initialEvents;
  const isAttendee = user?.role === "student" || !user?.role;
  const isOrganizer = user?.role === "organizer" || user?.role === "admin" || !user?.role;
  // Volunteers can also work the check-in desk and see their assigned tasks,
  // but can't create/delete events or tasks (that stays organizer/admin only).
  const isStaff = isOrganizer || user?.role === "volunteer";

  // Registration / ticketing state
  const [myRegistrations, setMyRegistrations] = useState<BackendRegistration[]>([]);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [ticketQrCache, setTicketQrCache] = useState<Record<string, string>>({});

  // Volunteer task state
  const [backendTasks, setBackendTasks] = useState<BackendTask[] | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskVolunteer, setNewTaskVolunteer] = useState("");

  // Attendance state
  const [attendanceEventId, setAttendanceEventId] = useState<string>("");
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [scanRegistrationId, setScanRegistrationId] = useState("");
  const [scanStatus, setScanStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Real aggregate counts for the home dashboard (organizer/admin only).
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const refreshMyRegistrations = () => {
    getMyRegistrations().then(setMyRegistrations);
  };

  const refreshTasks = () => {
    fetchTasks().then((list) => setBackendTasks(list));
  };

  // Load AI Data + real backend data on mount
  useEffect(() => {
    getEventRecommendations().then(setRecommendations);
    generateAIAnalyticsInsights().then(setInsights);
    fetchBackendEvents().then((list) => {
      if (list.length > 0) setBackendEvents(list.map(mapBackendEventToItem));
    });
    refreshMyRegistrations();
    refreshTasks();
    if (isOrganizer) {
      getDashboardStats().then(setDashboardStats);
    }
    setFilteredEvents(initialEvents);
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (baseEvents.length > 0 && !attendanceEventId) {
      setAttendanceEventId(baseEvents[0]!.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendEvents]);

  const refreshAttendance = () => {
    if (!attendanceEventId) return;
    getEventAttendance(attendanceEventId).then(setAttendance);
  };

  useEffect(() => {
    refreshAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceEventId]);

  // Handle Natural Language Smart Search
  useEffect(() => {
    const all = [...createdEvents, ...baseEvents];
    smartSearchEvents(searchQuery, all).then((res) => setFilteredEvents(res as EventItem[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, createdEvents, backendEvents]);

  const registeredEventIds = myRegistrations
    .filter((r) => r.status === "registered")
    .map((r) => (typeof r.event === "string" ? r.event : r.event._id));

  const handleRegister = async (eventId: string) => {
    setRegisteringEventId(eventId);
    const reg = await registerForEvent(eventId);
    setRegisteringEventId(null);
    if (reg) {
      refreshMyRegistrations();
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    const ok = await cancelRegistration(registrationId);
    if (ok) refreshMyRegistrations();
  };

  const handleShowQr = async (registrationId: string) => {
    if (ticketQrCache[registrationId]) return;
    const qr = await getRegistrationQr(registrationId);
    if (qr) setTicketQrCache((prev) => ({ ...prev, [registrationId]: qr }));
  };

  const handleCheckIn = async () => {
    const id = scanRegistrationId.trim();
    if (!id) return;
    setIsScanning(true);
    setScanStatus(null);
    const reg = await checkInRegistration(id);
    setIsScanning(false);
    if (reg) {
      setScanStatus({ kind: "success", message: "Checked in successfully." });
      setScanRegistrationId("");
      refreshAttendance();
    } else {
      setScanStatus({ kind: "error", message: "Check-in failed — invalid ticket ID, already checked in, or you don't have permission." });
    }
  };

  const handleCheckOut = async () => {
    const id = scanRegistrationId.trim();
    if (!id) return;
    setIsScanning(true);
    setScanStatus(null);
    const reg = await checkOutRegistration(id);
    setIsScanning(false);
    if (reg) {
      setScanStatus({ kind: "success", message: "Checked out successfully." });
      setScanRegistrationId("");
      refreshAttendance();
    } else {
      setScanStatus({ kind: "error", message: "Check-out failed — the ticket may not be checked in yet." });
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !attendanceEventId) return;
    const payload: { title: string; event: string; assignedVolunteer?: string } = {
      title: newTaskTitle.trim(),
      event: attendanceEventId,
    };
    const volunteerId = newTaskVolunteer.trim();
    if (volunteerId) payload.assignedVolunteer = volunteerId;
    const created = await createBackendTask(payload);
    if (created) {
      setNewTaskTitle("");
      setNewTaskVolunteer("");
      refreshTasks();
    }
  };

  const handleAssignTask = async (taskId: string, volunteerId: string) => {
    const updated = await assignBackendTask(taskId, volunteerId || null);
    if (updated) refreshTasks();
  };

  const handleRemoveAssignment = async (taskId: string) => {
    const updated = await assignBackendTask(taskId, null);
    if (updated) refreshTasks();
  };

  const handleToggleTaskStatus = async (task: BackendTask) => {
    const next = task.status === "done" ? "assigned" : "done";
    const updated = await updateBackendTaskStatus(task._id, next);
    if (updated) refreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    const ok = await deleteBackendTask(taskId);
    if (ok) refreshTasks();
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleSaveGeneratedEvent = async (data: EventGeneratedData) => {
    const created = await createBackendEvent({
      title: "AI Generated Event Draft",
      description: data.description,
      category: "AI Generated",
    });
    if (created) {
      setBackendEvents((prev) => [mapBackendEventToItem(created), ...(prev ?? [])]);
      return;
    }
    // Backend unreachable — fall back to local-only draft so the UI still works offline.
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

  const handleWizardSubmit = async (values: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    price: string;
  }) => {
    const priceNum = Number(values.price) || 0;
    const capacityNum = Number(values.capacity) || 0;
    const startAt = values.date ? `${values.date}T00:00:00` : undefined;

    const created = await createBackendEvent({
      title: values.title,
      description: values.description,
      startAt,
      venue: values.location,
      capacity: capacityNum,
      category: "Custom Event",
    });
    if (created) {
      setBackendEvents((prev) => [mapBackendEventToItem(created), ...(prev ?? [])]);
      return;
    }

    // Backend unreachable — fall back to local-only draft so the UI still works offline.
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
      { title: "Total registrations", value: dashboardStats?.totalRegistrations ?? 24563, icon: <Users2 className="size-5" />, trend: "+12.5%", trendUp: true, tone: "primary" as const, caption: dashboardStats ? "live from backend" : "vs. last quarter", spark: [8, 12, 10, 16, 14, 20, 24] },
      { title: "Active events", value: dashboardStats?.publishedEvents ?? 48, icon: <Calendar className="size-5" />, trend: "+18.2%", trendUp: true, tone: "success" as const, caption: dashboardStats ? `${dashboardStats.totalEvents} total` : "6 running today", spark: [4, 6, 5, 9, 8, 11, 12] },
      { title: "Matched volunteers", value: dashboardStats?.totalVolunteers ?? 1847, icon: <UserCheck className="size-5" />, trend: "+23.1%", trendUp: true, tone: "accent" as const, caption: dashboardStats ? `${dashboardStats.completedTasks}/${dashboardStats.totalTasks} tasks done` : "92% coverage", spark: [10, 9, 13, 12, 17, 19, 22] },
      { title: dashboardStats ? "Checked in" : "AI accuracy rating", value: dashboardStats?.checkedIn ?? "98.4%", icon: <Sparkles className="size-5" />, trend: "+4.3%", trendUp: true, tone: "warning" as const, caption: dashboardStats ? `${dashboardStats.checkedOut} checked out` : "across 231 runs", spark: [14, 15, 15, 17, 18, 18, 20] },
    ],
    [dashboardStats],
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
            showRegister={isAttendee}
            registeredEventIds={registeredEventIds}
            registeringEventId={registeringEventId}
            onRegister={handleRegister}
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
            showRegister={isAttendee}
            registeredEventIds={registeredEventIds}
            registeringEventId={registeringEventId}
            onRegister={handleRegister}
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

  const renderTasks = () => {
    const liveTasks = backendTasks ?? [];
    const usingLiveData = liveTasks.length > 0;

    return (
      <motion.div key="tasks" {...fade} className="space-y-6">
        <SectionHeading
          title="Your tasks"
          subtitle={
            usingLiveData
              ? "Live volunteer assignments from the backend"
              : "Assignments generated from your event schedule"
          }
          actions={<AIActionButton size="md" label="Generate Schedule" onClick={() => runAIAction("Generate Schedule")} />}
        />

        {isOrganizer && (
          <Panel className="p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              Create a task for &quot;{baseEvents.find((e) => e.id === attendanceEventId)?.title || "the selected event"}&quot;
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title (e.g. Check-in Desk Lead)"
                className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <input
                value={newTaskVolunteer}
                onChange={(e) => setNewTaskVolunteer(e.target.value)}
                placeholder="Volunteer user ID (optional)"
                className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 sm:max-w-[220px]"
              />
              <Button variant="primary" size="sm" onClick={handleAddTask} icon={<Plus className="size-4" />}>
                Add task
              </Button>
            </div>
          </Panel>
        )}

        {usingLiveData ? (
          <Panel className="divide-y divide-border overflow-hidden">
            {liveTasks.map((t) => {
              const eventLabel = typeof t.event === "string" ? t.event : t.event.title;
              const volunteerLabel =
                t.assignedVolunteer && typeof t.assignedVolunteer !== "string"
                  ? t.assignedVolunteer.name
                  : t.assignedVolunteer || "Unassigned";
              return (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 transition-colors hover:bg-muted/60 sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <CheckSquare className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{t.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {eventLabel} • {volunteerLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge tone={statusTone(t.status)} dot>
                      {t.status.replace("_", " ")}
                    </StatusBadge>
                    {(isOrganizer || (user?.role === "volunteer" && String(t.assignedVolunteer && typeof t.assignedVolunteer !== "string" ? t.assignedVolunteer._id : t.assignedVolunteer) === String(user?.id))) && (
                      <button
                        title="Toggle done"
                        onClick={() => handleToggleTaskStatus(t)}
                        className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <CheckSquare className="size-4" />
                      </button>
                    )}
                    {isOrganizer && (
                      <>
                        {t.assignedVolunteer && (
                          <button
                            title="Remove assignment"
                            onClick={() => handleRemoveAssignment(t._id)}
                            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
                          >
                            <UserMinus className="size-4" />
                          </button>
                        )}
                        <button
                          title="Delete task"
                          onClick={() => handleDeleteTask(t._id)}
                          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </Panel>
        ) : (
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
        )}
      </motion.div>
    );
  };

  const renderMyTickets = () => (
    <motion.div key="my-tickets" {...fade} className="space-y-6">
      <SectionHeading
        title="My tickets"
        subtitle="Your event registrations and QR check-in passes"
        icon={<Ticket className="size-4" />}
      />
      {myRegistrations.length === 0 ? (
        <Panel className="p-8 text-center text-sm text-muted-foreground">
          You haven&apos;t registered for any events yet. Head to Events to grab a ticket.
        </Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myRegistrations.map((reg) => {
            const eventTitle = typeof reg.event === "string" ? reg.event : reg.event.title;
            const qr = ticketQrCache[reg._id];
            return (
              <Panel key={reg._id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{eventTitle}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Ticket #{reg._id}</p>
                  </div>
                  <StatusBadge tone={statusTone(reg.status === "cancelled" ? "cancelled" : reg.checkedInAt ? "confirmed" : "pending")}>
                    {reg.status === "cancelled" ? "Cancelled" : reg.checkedOutAt ? "Checked out" : reg.checkedInAt ? "Checked in" : "Registered"}
                  </StatusBadge>
                </div>

                {qr ? (
                  <img src={qr} alt="Registration QR code" className="mx-auto mt-4 size-36 rounded-xl border border-border p-2" />
                ) : (
                  <Button variant="soft" size="sm" className="mt-4 w-full" onClick={() => handleShowQr(reg._id)} icon={<QrCode className="size-4" />}>
                    Show QR ticket
                  </Button>
                )}

                {reg.status !== "cancelled" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleCancelRegistration(reg._id)}
                    icon={<X className="size-4" />}
                  >
                    Cancel registration
                  </Button>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  const renderAttendance = () => (
    <motion.div key="attendance" {...fade} className="space-y-6">
      <SectionHeading
        title="Attendance"
        subtitle="Live check-in / check-out status per event"
        icon={<ClipboardCheck className="size-4" />}
      />
      <Panel className="p-4 sm:p-5">
        <label className="mb-2 block text-xs font-semibold text-muted-foreground">Event</label>
        <select
          value={attendanceEventId}
          onChange={(e) => setAttendanceEventId(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 sm:max-w-sm"
        >
          {baseEvents.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Registered", value: attendance?.registered ?? 0, icon: <Users2 className="size-5" />, tone: "primary" as const },
          { title: "Checked in", value: attendance?.checkedIn ?? 0, icon: <LogIn className="size-5" />, tone: "success" as const },
          { title: "Checked out", value: attendance?.checkedOut ?? 0, icon: <LogOutIcon className="size-5" />, tone: "accent" as const },
          { title: "Not arrived", value: attendance?.notArrived ?? 0, icon: <Clock className="size-5" />, tone: "warning" as const },
        ].map((s, i) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} tone={s.tone} delay={i * 0.05} />
        ))}
      </div>

      {isStaff && (
        <Panel className="p-4 sm:p-5">
          <p className="mb-1 text-sm font-semibold text-foreground">Check-in desk</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Scan or paste an attendee&apos;s ticket ID (the value encoded in their QR pass) to check them in or out.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <QrCode className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={scanRegistrationId}
                onChange={(e) => setScanRegistrationId(e.target.value)}
                placeholder="Ticket / registration ID"
                className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCheckIn}
              disabled={isScanning || !scanRegistrationId.trim()}
              icon={<LogIn className="size-4" />}
            >
              Check in
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckOut}
              disabled={isScanning || !scanRegistrationId.trim()}
              icon={<LogOutIcon className="size-4" />}
            >
              Check out
            </Button>
          </div>
          <AnimatePresence>
            {scanStatus && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-3 text-xs font-medium ${scanStatus.kind === "success" ? "text-success" : "text-destructive"}`}
              >
                {scanStatus.message}
              </motion.p>
            )}
          </AnimatePresence>
        </Panel>
      )}

      {!attendance && (
        <Panel className="p-6 text-center text-sm text-muted-foreground">
          No live attendance data yet — this appears once organizers, volunteers and MongoDB are connected.
        </Panel>
      )}
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
    "my-tickets": renderMyTickets,
    volunteers: renderVolunteers,
    tasks: renderTasks,
    attendance: renderAttendance,
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
        role={user?.role}
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
