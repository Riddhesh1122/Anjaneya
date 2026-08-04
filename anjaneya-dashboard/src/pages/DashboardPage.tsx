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
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatCard from '../components/StatCard';
import ActivityTable from '../components/ActivityTable';

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
  const navigate = useNavigate();

  // Navigation & Search state
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Section Minimization States
  const [isRecsMinimized, setIsRecsMinimized] = useState(false);
  const [isEventsMinimized, setIsEventsMinimized] = useState(false);
  const [isVolunteersMinimized, setIsVolunteersMinimized] = useState(false);
  const [isTasksMinimized, setIsTasksMinimized] = useState(false);

  // AI Modals state
  const [generatorModalMode, setGeneratorModalMode] = useState<GeneratorMode | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Data states
  const [recommendations, setRecommendations] = useState<RecommendedEvent[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);

  // Sample Events Database
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

  // Load AI Data on mount
  useEffect(() => {
    getEventRecommendations().then(setRecommendations);
    generateAIAnalyticsInsights().then(setInsights);
    setFilteredEvents(initialEvents);
  }, []);

  // Handle Natural Language Smart Search
  useEffect(() => {
    const all = [...createdEvents, ...initialEvents];
    smartSearchEvents(searchQuery, all).then(setFilteredEvents);
  }, [searchQuery, createdEvents]);

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

  /* Stats cards */
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
      value: '48',
      icon: <Calendar className="w-5 h-5 text-white" />,
      trend: '+18.2%',
      trendUp: true,
      color: 'emerald',
    },
    {
      title: 'Matched Volunteers',
      value: '1,847',
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

  // 1. HOME / DASHBOARD VIEW
  const renderHome = () => (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user?.name || 'Organizer'}</span> 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Here is your AI-Powered Event & Volunteer Management overview.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>LLM Settings</span>
          </button>
          <button
            onClick={() => setGeneratorModalMode('event')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ Create Event with AI</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* AI RECOMMENDATIONS SECTION WITH MINIMIZE / EXPAND */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Recommended For You</h2>
            <span className="text-xs text-purple-300 font-medium bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 hidden sm:inline-block">
              Personalized by AI
            </span>
          </div>

          <button
            onClick={() => setIsRecsMinimized(!isRecsMinimized)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <span>{isRecsMinimized ? 'Expand List' : 'Minimize List'}</span>
            {isRecsMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {!isRecsMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((event) => (
                  <AIRecommendationCard key={event.id} event={event} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity Table full width */}
      <div className="w-full">
        <ActivityTable />
      </div>
    </motion.div>
  );

  // 2. EVENTS PAGE & CREATE EVENT WITH MINIMIZE TOGGLE
  const renderEvents = () => (
    <motion.div
      key="events"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Event Hub</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Manage, filter, and generate events using AI</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEventsMinimized(!isEventsMinimized)}
            className="px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-white/10"
          >
            <span>{isEventsMinimized ? 'Expand Events' : 'Minimize Events'}</span>
            {isEventsMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setGeneratorModalMode('event')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>✨ Generate with AI</span>
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
          <span>
            🔍 Showing AI Smart Search results for: <strong>"{searchQuery}"</strong> ({filteredEvents.length} events found)
          </span>
          <button onClick={() => setSearchQuery('')} className="text-xs text-purple-400 underline">Clear Filter</button>
        </div>
      )}

      <AnimatePresence>
        {!isEventsMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev) => (
                <motion.div
                  key={ev.id}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {ev.category}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">{ev.isFree ? 'Free Pass' : `$${ev.price}`}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{ev.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{ev.description}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> {ev.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-pink-400" /> {ev.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // 3. VOLUNTEERS & AI ASSIGNMENT PAGE WITH MINIMIZE TOGGLE
  const renderVolunteers = () => (
    <motion.div
      key="volunteers"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Organizer Volunteer Management</h1>
          <p className="text-slate-400 text-xs sm:text-sm">AI Automated Skill Matching & Assignment</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVolunteersMinimized(!isVolunteersMinimized)}
            className="px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-white/10"
          >
            <span>{isVolunteersMinimized ? 'Expand Volunteers' : 'Minimize Volunteers'}</span>
            {isVolunteersMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setGeneratorModalMode('volunteer')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <UserCheck className="w-4 h-4" />
            <span>Launch AI Volunteer Matcher</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isVolunteersMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Aarav Sharma', role: 'Check-in Lead', score: '96%', status: 'Assigned', skills: ['Registration', 'React'] },
                { name: 'Priya Patel', role: 'AV Stage Setup', score: '91%', status: 'Confirmed', skills: ['AV Sound', 'Logistics'] },
                { name: 'Rohan Verma', role: 'Speaker Liaison', score: '88%', status: 'Pending', skills: ['Public Relations', 'Python'] },
              ].map((vol) => (
                <div key={vol.name} className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white text-sm">{vol.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {vol.score} Fit
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Assigned Role: <strong className="text-slate-200">{vol.role}</strong></p>
                  <div className="flex flex-wrap gap-1">
                    {vol.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[10px] bg-white/10 text-slate-300">{s}</span>
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

  // 4. TASKS PAGE WITH MINIMIZE TOGGLE
  const renderTasks = () => (
    <motion.div
      key="tasks"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your Assigned Tasks</h1>
        <button
          onClick={() => setIsTasksMinimized(!isTasksMinimized)}
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-white/10"
        >
          <span>{isTasksMinimized ? 'Expand Tasks' : 'Minimize Tasks'}</span>
          {isTasksMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {!isTasksMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-3"
          >
            {[
              { task: 'Check-in Desk Leader', event: 'AI & ML Innovations Summit', time: 'Today, 9:30 AM', priority: 'High' },
              { task: 'AV & Projection Setup', event: 'Global Hackathon', time: 'Aug 6, 1:00 PM', priority: 'Medium' },
              { task: 'Web Development Mentor', event: 'Community Code Sprint', time: 'Aug 8, 3:00 PM', priority: 'High' },
            ].map((t, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.task}</p>
                    <p className="text-xs text-slate-400">{t.event} • {t.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {t.priority} Priority
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
    home: renderHome,
    events: renderEvents,
    volunteers: renderVolunteers,
    tasks: renderTasks,
    analytics: renderAnalytics,
    'ai-studio': renderAIStudio,
    users: renderUsers,
    settings: renderSettings,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 flex relative text-slate-100"
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAIStudio={() => setGeneratorModalMode('event')}
          onOpenAIConfig={() => setShowConfigModal(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {sectionRenderers[activeSection]?.()}
          </AnimatePresence>
        </main>
      </div>

      {/* FLOATING AI ASSISTANT BUTTON (ON EVERY PAGE) */}
      <FloatingAIButton />

      {/* AI GENERATOR MODAL */}
      <AnimatePresence>
        {generatorModalMode && (
          <AIGeneratorModal
            initialMode={generatorModalMode}
            onClose={() => setGeneratorModalMode(null)}
            onSaveEventData={handleSaveGeneratedEvent}
          />
        )}
      </AnimatePresence>

      {/* AI LLM PROVIDER & KEY SETTINGS MODAL */}
      <AnimatePresence>
        {showConfigModal && <AIConfigModal onClose={() => setShowConfigModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
