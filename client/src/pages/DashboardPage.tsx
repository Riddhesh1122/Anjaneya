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

// Role Views & Specialized Components
import QRCodeModal from '../components/QRCodeModal';
import EventDetailsModal from '../components/EventDetailsModal';
import VolunteerTaskBoard from '../components/VolunteerTaskBoard';
import AdminOverview from '../components/AdminOverview';

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
      title: 'AI Generated Event Draft',
      category: 'AI Generated',
      date: 'Aug 20, 2026',
      location: 'Innovation Center',
      attendees: 1,
      description: data.description,
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
            <h1 className={`text-xl font-semibold ${textPri}`}>
              {greeting}, <span className="text-amber-500">{user?.name?.split(' ')[0] || 'there'}</span> 👋
            </h1>
            <p className={`text-xs mt-0.5 ${textMut}`}>{dateStr} · Here's what's happening on your platform.</p>
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
    const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const textMut = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';

    return (
      <motion.div
        key="events"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl font-semibold ${textPri}`}>Event Hub</h1>
            <p className={`text-xs mt-0.5 ${textMut}`}>Manage, search, and generate events using AI</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEventsMinimized(!isEventsMinimized)}
            >
              {isEventsMinimized ? 'Expand Events' : 'Minimize Events'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-zinc-950" />}
              onClick={() => setGeneratorModalMode('event')}
            >
              Generate with AI
            </Button>
          </div>
        </div>

        {searchQuery && (
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <span>🔍 Showing AI Smart Search results for: <strong>"{searchQuery}"</strong> ({filteredEvents.length} found)</span>
            <button onClick={() => setSearchQuery('')} className="font-semibold underline cursor-pointer">Clear Filter</button>
          </div>
        )}

        {isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6 text-amber-500" />}
            title="No events found"
            description={searchQuery ? `No events matched your search query "${searchQuery}".` : "You haven't created any events yet."}
            actionLabel="Generate Event with AI"
            onAction={() => setGeneratorModalMode('event')}
          />
        ) : (
          <AnimatePresence>
            {!isEventsMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((ev) => (
                    <motion.div
                      key={ev.id}
                      whileHover={{ y: -3 }}
                      className={`p-5 rounded-xl border ${cardBg} flex flex-col justify-between transition-all group`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="amber">{ev.category}</Badge>
                          <span className="text-xs text-emerald-500 font-semibold">{ev.isFree ? 'Free Pass' : `$${ev.price}`}</span>
                        </div>
                        <h3 className={`text-sm font-semibold mb-1 group-hover:text-amber-500 transition-colors ${textPri}`}>{ev.title}</h3>
                        <p className={`text-xs mb-4 line-clamp-2 leading-relaxed ${textMut}`}>{ev.description}</p>
                      </div>

                      <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                        <div className={`flex items-center justify-between text-xs ${textMut}`}>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {ev.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {ev.location}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailsModalEvent(ev)}>
                            Details
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => setQrModalEvent(ev)} leftIcon={<QrCode className="w-3.5 h-3.5" />}>
                            QR Pass
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
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

  // 6. AI STUDIO TOOLS PAGE
  const renderAIStudio = () => (
    <motion.div
      key="ai-studio"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Anjaneya AI Studio</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Select an AI tool to generate content automatically</p>
        </div>
        <button
          onClick={() => setShowConfigModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-purple-500/30"
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Configure Provider API Key</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'event', title: 'AI Event Description Generator', desc: 'Generate complete agenda, rules, FAQs & code of conduct.', icon: FileText, color: 'from-indigo-500 to-purple-600' },
          { id: 'volunteer', title: 'AI Volunteer Allocator', desc: 'Match volunteers based on skills, availability & experience.', icon: UserCheck, color: 'from-purple-500 to-pink-600' },
          { id: 'certificate', title: 'AI Certificate Writer', desc: 'Auto-write appreciation text for volunteers and participants.', icon: Award, color: 'from-amber-500 to-rose-600' },
          { id: 'email', title: 'AI Email Generator', desc: 'Draft confirmations, reminders, invitations & thank you emails.', icon: Mail, color: 'from-teal-500 to-emerald-600' },
          { id: 'faq', title: 'AI Smart FAQ Generator', desc: 'Build instant structured FAQ pairs from event details.', icon: HelpCircle, color: 'from-blue-500 to-indigo-600' },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              whileHover={{ y: -6 }}
              onClick={() => setGeneratorModalMode(tool.id as GeneratorMode)}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/40 backdrop-blur-xl cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{tool.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-purple-300">
                <span>Launch AI Tool</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

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
    volunteers: renderVolunteers,
    tasks: renderTasks,
    analytics: renderAnalytics,
    'ai-studio': renderAIStudio,
    users: renderUsers,
    settings: renderSettings,
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
