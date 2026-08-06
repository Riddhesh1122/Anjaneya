import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  UserCheck,
  CheckSquare,
  Plus,
  Search,
  Award,
  Mail,
  HelpCircle,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ChevronUp,
  ChevronDown,
  Ticket,
  QrCode,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatCard from '../components/StatCard';
import ActivityTable from '../components/ActivityTable';

import MetricCard from '../components/dashboard/MetricCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentEvents from '../components/dashboard/RecentEvents';
import AIWidget from '../components/dashboard/AIWidget';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import VolunteerPanel from '../components/dashboard/VolunteerPanel';

// UI Primitives
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';

// AI Suite Components
import AIPromptLibrary from '../components/ai/AIPromptLibrary';
import AIHistoryPanel from '../components/ai/AIHistoryPanel';

// Role Views & Specialized Components
import QRCodeModal from '../components/QRCodeModal';
import EventDetailsModal from '../components/EventDetailsModal';
import VolunteerTaskBoard from '../components/VolunteerTaskBoard';
import AdminOverview from '../components/AdminOverview';

// Specialized Pages
import QRScannerPage from './QRScannerPage';
import NotificationCenterPage from './NotificationCenterPage';
import TeamDashboardPage from './TeamDashboardPage';
import EventDiscoveryHub from '../components/dashboard/EventDiscoveryHub';
import SettingsPage from './SettingsPage';
import AuditLogsPage from './AuditLogsPage';

// AI Components
import FloatingAIButton from '../components/ai/FloatingAIButton';
import AIRecommendationCard from '../components/ai/AIRecommendationCard';
import AIInsightCard from '../components/ai/AIInsightCard';
import AIGeneratorModal, { GeneratorMode } from '../components/ai/AIGeneratorModal';
import AIConfigModal from '../components/ai/AIConfigModal';

// AI Service API
import {
  getEventRecommendations,
  generateAIAnalyticsInsights,
  smartSearchEvents,
  getAIConfig,
  RecommendedEvent,
  AIInsight,
  EventGeneratedData
} from '../services/aiApi';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Navigation & Search state
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiStudioTab, setAiStudioTab] = useState<'tools' | 'prompts' | 'history'>('tools');

  // Section Minimization States
  const [isRecsMinimized, setIsRecsMinimized] = useState(false);
  const [isEventsMinimized, setIsEventsMinimized] = useState(false);
  const [isVolunteersMinimized, setIsVolunteersMinimized] = useState(false);
  const [isTasksMinimized, setIsTasksMinimized] = useState(false);

  // Role & Specialized Modals state
  const [currentRole, setCurrentRole] = useState<'organizer' | 'attendee' | 'volunteer' | 'admin'>('organizer');
  const [qrModalEvent, setQrModalEvent] = useState<any>(null);
  const [detailsModalEvent, setDetailsModalEvent] = useState<any>(null);

  // AI Modals state
  const [generatorModalMode, setGeneratorModalMode] = useState<GeneratorMode | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Data states
  const [recommendations, setRecommendations] = useState<RecommendedEvent[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);

  // Real backend data states
  const [realEvents, setRealEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [realVolunteers, setRealVolunteers] = useState<any[]>([]);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(true);
  const [volunteersError, setVolunteersError] = useState<string | null>(null);

  const [realTasks, setRealTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Sample Events Database Fallback
  const initialEvents = [
    {
      id: 'ev-1',
      title: 'AI & ML Innovations Summit 2026',
      category: 'Artificial Intelligence',
      date: 'Today, Aug 4',
      location: 'Pune Tech Park / Hybrid',
      attendees: 420,
      description: 'Explore state-of-the-art LLMs, autonomous agents, and production deployment strategies.',
      isToday: true,
      price: 0,
      isFree: true,
      needsVolunteers: true,
    },
    {
      id: 'ev-2',
      title: 'Global Hackathon & Code Sprint',
      category: 'Hackathons',
      date: 'Aug 6 - Aug 8',
      location: 'Main Tech Hub, Stage A',
      attendees: 280,
      description: '48-hour buildathon with $25,000 in prizes across AI, Sustainability, and Web3 tracks.',
      isToday: false,
      price: 0,
      isFree: true,
      needsVolunteers: true,
    },
    {
      id: 'ev-3',
      title: 'Cyber Security & Zero Trust Workshop',
      category: 'Cyber Security',
      date: 'Aug 14',
      location: 'Convention Center Lab 2',
      attendees: 115,
      description: 'Hands-on CTF challenges and serverless security architecture session.',
      isToday: false,
      price: 25,
      isFree: false,
      needsVolunteers: false,
    },
  ];

  // Load AI & Backend Data on mount
  useEffect(() => {
    let isMounted = true;

    getEventRecommendations().then((res) => { if (isMounted) setRecommendations(res); });
    generateAIAnalyticsInsights().then((res) => { if (isMounted) setInsights(res); });

    // Fetch real events
    setIsLoadingEvents(true);
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : data.data || [];
        if (items.length > 0) {
          setRealEvents(items);
          setFilteredEvents(items);
        } else {
          setRealEvents(initialEvents);
          setFilteredEvents(initialEvents);
        }
        setIsLoadingEvents(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Events API fetch failed:', err);
        setRealEvents(initialEvents);
        setFilteredEvents(initialEvents);
        setEventsError('Unable to connect to live database. Displaying local cache.');
        setIsLoadingEvents(false);
      });

    // Fetch real volunteers
    setIsLoadingVolunteers(true);
    fetch('/api/volunteers')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : data.data || [];
        setRealVolunteers(items);
        setIsLoadingVolunteers(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Volunteers API fetch failed:', err);
        setVolunteersError('Volunteer service offline. Connect MongoDB to enable persistent volunteer matching.');
        setIsLoadingVolunteers(false);
      });

    // Fetch real tasks
    setIsLoadingTasks(true);
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : data.data || [];
        setRealTasks(items);
        setIsLoadingTasks(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Tasks API fetch failed:', err);
        setTasksError('Task management service offline. Connect MongoDB to sync task assignments.');
        setIsLoadingTasks(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Handle Natural Language Smart Search
  useEffect(() => {
    let isMounted = true;
    const all = [...createdEvents, ...(realEvents.length > 0 ? realEvents : initialEvents)];
    smartSearchEvents(searchQuery, all).then((res) => {
      if (isMounted) setFilteredEvents(res);
    });
    return () => { isMounted = false; };
  }, [searchQuery, createdEvents, realEvents]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveGeneratedEvent = (data: EventGeneratedData) => {
    const newEvent = {
      id: `ev-${Date.now()}`,
      title: (data as any).title || 'AI Generated Event Draft',
      category: (data as any).category || 'AI Generated',
      date: 'Aug 20, 2026',
      location: 'Innovation Center',
      attendees: 1,
      description: data.description || 'Custom generated event description.',
      isToday: false,
      price: 0,
      isFree: true,
      needsVolunteers: true,
    };
    setCreatedEvents((prev) => [newEvent, ...prev]);
  };

  /* Dynamic Stats cards */
  const stats = [
    {
      title: 'Total Users',
      value: '24,563',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      trend: '+12.5%',
      trendUp: true,
      color: 'indigo',
    },
    {
      title: 'Active Events',
      value: String(filteredEvents.length || realEvents.length || 3),
      icon: <Calendar className="w-5 h-5 text-white" />,
      trend: '+18.2%',
      trendUp: true,
      color: 'emerald',
    },
    {
      title: 'Matched Volunteers',
      value: String(realVolunteers.length || 3),
      icon: <UserCheck className="w-5 h-5 text-white" />,
      trend: '+23.1%',
      trendUp: true,
      color: 'amber',
    },
    {
      title: 'AI Accuracy Rating',
      value: '98.4%',
      icon: <Sparkles className="w-5 h-5 text-white" />,
      trend: '+4.3%',
      trendUp: true,
      color: 'rose',
    },
  ];

  /* Section Content Renderers */

  // 1. HOME / DASHBOARD VIEW — redesigned
  const renderHome = () => {
    const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

    const metricData = [
      {
        title: 'Active Events',
        value: filteredEvents.length || 3,
        trend: '18.2%',
        trendUp: true,
        icon: <Calendar className="w-4 h-4 text-amber-500" />,
        sparkline: [30, 45, 40, 60, 55, 70, 65, filteredEvents.length * 20 || 80],
      },
      {
        title: 'Volunteers Matched',
        value: realVolunteers.length || 3,
        trend: '23.1%',
        trendUp: true,
        icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
        sparkline: [20, 35, 30, 50, 45, 60, 55, 75],
      },
      {
        title: 'Total Registrations',
        value: '8,642',
        trend: '12.5%',
        trendUp: true,
        icon: <CheckSquare className="w-4 h-4 text-violet-400" />,
        sparkline: [50, 65, 55, 80, 70, 85, 78, 95],
      },
      {
        title: 'AI Accuracy',
        value: '98.4%',
        trend: '4.3%',
        trendUp: true,
        icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
        sparkline: [80, 82, 85, 88, 86, 90, 92, 95],
      },
    ];

    return (
      <motion.div
        key="home"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${textPri}`}>
              {greeting}, <span className="text-amber-500">{user?.name?.split(' ')[0] || 'there'}</span> 👋
            </h1>
            <p className={`text-sm font-medium mt-1 ${textMut}`}>{dateStr} · Real-time event & volunteer intelligence overview.</p>
          </div>
          <QuickActions
            onCreateEvent={() => setGeneratorModalMode('event')}
            onAIGenerate={() => setGeneratorModalMode('event')}
            onInviteVolunteer={() => setGeneratorModalMode('volunteer')}
          />
        </div>

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {metricData.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={i * 0.07} />
          ))}
        </div>

        {/* ── Recent Events + AI Widget ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentEvents
              events={filteredEvents}
              onViewDetails={ev => setDetailsModalEvent(ev)}
              onGetQR={ev => setQrModalEvent(ev)}
            />
          </div>
          <AIWidget
            onLaunchAI={() => setGeneratorModalMode('event')}
            onVolunteerMatch={() => setGeneratorModalMode('volunteer')}
          />
        </div>

        {/* ── Volunteer Panel + Activity Feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <VolunteerPanel />
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </motion.div>
    );
  };

  // 2. EVENTS PAGE
  const renderEvents = () => {
    return (
      <motion.div
        key="events"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
      >
        <EventDiscoveryHub
          events={filteredEvents}
          onViewDetails={ev => setDetailsModalEvent(ev)}
          onGetQR={ev => setQrModalEvent(ev)}
        />
      </motion.div>
    );
  };

  // 3. VOLUNTEERS PAGE
  const renderVolunteers = () => {
    const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';

    return (
      <motion.div
        key="volunteers"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-semibold ${textPri}`}>Volunteer Management</h1>
            <p className={`text-xs mt-0.5 ${textMut}`}>AI Automated Skill Matching & Allocation</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsVolunteersMinimized(!isVolunteersMinimized)}>
              {isVolunteersMinimized ? 'Expand' : 'Minimize'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              onClick={() => setGeneratorModalMode('volunteer')}
            >
              Launch AI Matcher
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {!isVolunteersMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Aarav Sharma', role: 'Check-in Lead', score: '96%', status: 'Assigned', skills: ['Registration', 'React'] },
                  { name: 'Priya Patel', role: 'AV Stage Setup', score: '91%', status: 'Confirmed', skills: ['AV Sound', 'Logistics'] },
                  { name: 'Rohan Verma', role: 'Speaker Liaison', score: '88%', status: 'Pending', skills: ['Public Relations', 'Python'] },
                ].map((vol) => (
                  <div key={vol.name} className={`p-5 rounded-xl border ${cardBg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold text-xs ${textPri}`}>{vol.name}</span>
                      <Badge variant="indigo">{vol.score} Fit</Badge>
                    </div>
                    <p className={`text-xs mb-3 ${textMut}`}>Assigned Role: <strong className={textPri}>{vol.role}</strong></p>
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.map((s) => (
                        <span key={s} className={`px-2 py-0.5 rounded text-[10px] ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // 4. TASKS PAGE (VOLUNTEER KANBAN DUTY BOARD)
  const renderTasks = () => (
    <motion.div
      key="tasks"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <VolunteerTaskBoard />
    </motion.div>
  );

  // 5. ANALYTICS & AI INSIGHTS PAGE
  const renderAnalytics = () => (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Analytics & AI Insights</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Real-time platform performance and AI recommendations</p>
      </div>

      {/* AI INSIGHTS CARDS */}
      <div>
        <h3 className="text-base font-bold text-purple-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Analytics Insights & Optimization Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((ins) => (
            <AIInsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </div>
    </motion.div>
  );

  // 6. AI STUDIO COPILOT HUB PAGE
  const renderAIStudio = () => {
    const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';

    const aiToolsList = [
      { id: 'event', title: 'AI Event Description Generator', desc: 'Auto-create description, 6-stage agenda, FAQs, and Code of Conduct.', icon: FileText, color: 'text-amber-500' },
      { id: 'volunteer', title: 'AI Volunteer Matcher & Allocator', desc: 'Skill matching, availability score, and instant volunteer assignment.', icon: UserCheck, color: 'text-indigo-400' },
      { id: 'email', title: 'AI Email Draft Writer', desc: 'Generate invitations, reminders, thank you emails, and winner notices.', icon: Mail, color: 'text-emerald-500' },
      { id: 'announcement', title: 'AI Broadcast Announcement Generator', desc: 'Draft High-Priority venue change, emergency, or event start alerts.', icon: Megaphone, color: 'text-rose-500' },
      { id: 'schedule', title: 'AI Event Schedule Planner', desc: 'Build 6-stage timetable with keynotes, workshops, and breaks.', icon: Clock, color: 'text-violet-400' },
      { id: 'faq', title: 'AI Smart FAQ Generator', desc: 'Generate structured Q&A pairs for attendees and participants.', icon: HelpCircle, color: 'text-amber-500' },
      { id: 'summary', title: 'AI Event Risk & Summary Generator', desc: 'Build comprehensive objectives, audience estimates, and risk analysis.', icon: ShieldAlert, color: 'text-rose-400' },
      { id: 'certificate', title: 'AI Certificate Writer', desc: 'Auto-write appreciation certificates for volunteers and mentors.', icon: Award, color: 'text-indigo-400' },
    ];

    return (
      <motion.div
        key="ai-studio"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl font-semibold ${textPri}`}>Anjaneya AI Studio & Copilot</h1>
            <p className={`text-xs mt-0.5 ${textMut}`}>AI-powered event management copilot for organizers, volunteers, and attendees</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Cpu className="w-3.5 h-3.5 text-amber-500" />}
              onClick={() => setShowConfigModal(true)}
            >
              LLM Provider Settings
            </Button>
          </div>
        </div>

        {/* Tab switcher: Generator Tools | Prompt Library | History */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Button
            variant={aiStudioTab === 'tools' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setAiStudioTab('tools')}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            AI Copilot Tools
          </Button>
          <Button
            variant={aiStudioTab === 'prompts' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setAiStudioTab('prompts')}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Prompt Library
          </Button>
          <Button
            variant={aiStudioTab === 'history' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setAiStudioTab('history')}
            leftIcon={<Clock className="w-3.5 h-3.5" />}
          >
            AI History & Starred
          </Button>
        </div>

        {/* TAB 1: TOOLS */}
        {aiStudioTab === 'tools' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiToolsList.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setGeneratorModalMode(tool.id as GeneratorMode)}
                  className={`p-5 rounded-xl border ${cardBg} hover:border-amber-500/40 cursor-pointer transition-all flex flex-col justify-between group`}
                >
                  <div>
                    <div className={`p-2.5 rounded-lg w-fit mb-3 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                      <Icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <h3 className={`text-xs font-bold mb-1.5 group-hover:text-amber-500 transition-colors ${textPri}`}>
                      {tool.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-3 ${textMut}`}>
                      {tool.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-amber-500 font-semibold">
                    <span>Launch AI Tool</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PROMPT LIBRARY */}
        {aiStudioTab === 'prompts' && (
          <AIPromptLibrary
            onSelectPrompt={(mode) => setGeneratorModalMode(mode)}
          />
        )}

        {/* TAB 3: AI HISTORY */}
        {aiStudioTab === 'history' && (
          <AIHistoryPanel />
        )}
      </motion.div>
    );
  };

  // 7. PRESERVED USERS PAGE
  const renderUsers = () => (
    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Community Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Alice Johnson', role: 'Admin', status: 'Active' },
          { name: 'Bob Smith', role: 'Developer', status: 'Active' },
          { name: 'Carol Davis', role: 'Designer', status: 'Away' },
        ].map((u) => (
          <div key={u.name} className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-sm font-semibold text-white">{u.name}</p>
            <p className="text-xs text-slate-400">{u.role}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // 8. PRESERVED SETTINGS PAGE
  const renderSettings = () => {
    const currentConfig = getAIConfig();
    return (
      <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white">
          <div>
            <p className="font-bold text-sm text-purple-300">Active LLM Provider: {currentConfig.provider.toUpperCase()}</p>
            <p className="text-slate-400 mt-0.5">Model: {currentConfig.model}</p>
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer hover:bg-purple-500/30"
          >
            Configure LLM Key
          </button>
        </div>
      </motion.div>
    );
  };

  const sectionRenderers: Record<string, () => JSX.Element> = {
    home: () => {
      if (currentRole === 'admin') {
        return (
          <motion.div
            key="admin-home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AdminOverview />
          </motion.div>
        );
      }
      return renderHome();
    },
    events: renderEvents,
    teams: () => <TeamDashboardPage />,
    volunteers: renderVolunteers,
    tasks: renderTasks,
    scanner: () => <QRScannerPage />,
    notifications: () => <NotificationCenterPage />,
    audit: () => <AuditLogsPage />,
    analytics: renderAnalytics,
    'ai-studio': renderAIStudio,
    users: renderUsers,
    settings: () => <SettingsPage />,
  };

  return (
    <SidebarProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}
      >
        {/* Sidebar — flex-shrink-0, sticky, participates in flexbox */}
        <Sidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          onLogout={handleLogout}
        />

        {/* Main content column — flex-1 fills all remaining space */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNavbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAIStudio={() => setGeneratorModalMode('event')}
            onOpenAIConfig={() => setShowConfigModal(true)}
            currentRole={currentRole}
            onRoleChange={(role) => setCurrentRole(role as any)}
          />

          <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
            <AnimatePresence mode="wait">
              {sectionRenderers[activeSection]?.()}
            </AnimatePresence>
          </main>
        </div>

        {/* ── Floating + Modal layers (use fixed positioning internally) ── */}
        <FloatingAIButton />

        <QRCodeModal
          isOpen={Boolean(qrModalEvent)}
          onClose={() => setQrModalEvent(null)}
          event={qrModalEvent}
          attendeeName={user?.name || 'Demo Attendee'}
        />

        <EventDetailsModal
          isOpen={Boolean(detailsModalEvent)}
          onClose={() => setDetailsModalEvent(null)}
          event={detailsModalEvent}
          onOpenQR={(ev) => setQrModalEvent(ev)}
        />

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
      </motion.div>
    </SidebarProvider>
  );
}
