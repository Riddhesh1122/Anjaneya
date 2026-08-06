import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Calendar, UserCheck, BarChart2, Cpu, ArrowRight,
  CheckCircle2, ChevronDown, Mail,
  Zap, Globe, Shield, Award, Users, TrendingUp, MessageSquare,
  Star, Menu, X, QrCode, Brain, Layers, Activity, HelpCircle
} from 'lucide-react';
import Logo from '../components/Logo';

/* ── Social Icons ── */
const IconGithub = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const IconTwitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconLinkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }
  }),
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-[120px]" />
    </div>
  );
}

/* ── NAVBAR ── */
function Navbar({ onNavigate }: { onNavigate: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Stats', href: '#stats' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-zinc-950/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="lg" />

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onNavigate}
              className="text-xs font-bold text-zinc-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNavigate}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get Started →
            </motion.button>
          </div>

          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="w-full text-left px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={onNavigate}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-amber-500 text-zinc-950 text-sm font-black text-center"
              >
                Get Started Free →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── STEP 2: HERO SECTION ── */
function Hero({ onNavigate }: { onNavigate: () => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20 pb-16">
      <GridBackground />

      <motion.div style={{ y }} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-6 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Anjaneya Hackathon 2026 — AI Platform
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>

        {/* Project Name & Main Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-4 text-center"
        >
          Anjaneya <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
            AI-Powered Event & Volunteer Management
          </span>
        </motion.h1>

        {/* Tagline & Description */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-center"
        >
          Streamline registrations, issue cryptographic HMAC QR passes, allocate volunteers using AI skill matching, and broadcast live updates instantly.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNavigate}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            Get Started
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-sm hover:border-amber-500/40 hover:text-white transition-all cursor-pointer"
          >
            Explore Events
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Dashboard Preview Window */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-10 mt-16 max-w-5xl mx-auto w-full px-4"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-zinc-950">
          <div className="h-9 bg-zinc-950 border-b border-zinc-800 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="flex-1 flex justify-center">
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-3 py-0.5 rounded-md border border-zinc-800">
                app.anjaneya.org/dashboard
              </span>
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs text-zinc-400 font-bold">Active Events</span>
              <p className="text-2xl font-black text-white mt-1">24</p>
              <span className="text-[10px] text-emerald-400 font-bold">Live & Check-in ready</span>
            </div>
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-xs text-zinc-400 font-bold">Volunteers</span>
              <p className="text-2xl font-black text-white mt-1">1,482</p>
              <span className="text-[10px] text-indigo-400 font-bold">Skill graph matched</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-zinc-400 font-bold">Registrations</span>
              <p className="text-2xl font-black text-white mt-1">2,840</p>
              <span className="text-[10px] text-emerald-400 font-bold">+18% growth</span>
            </div>
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <span className="text-xs text-zinc-400 font-bold">Check-in Rate</span>
              <p className="text-2xl font-black text-white mt-1">84.2%</p>
              <span className="text-[10px] text-violet-400 font-bold">HMAC Signed Passes</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── STEP 3: STATISTICS COUNTERS SECTION ── */
function Statistics() {
  const statsList = [
    { label: 'Total Events', value: '2,400+', icon: Calendar, color: 'text-amber-400' },
    { label: 'Active Users', value: '14,800+', icon: Users, color: 'text-indigo-400' },
    { label: 'Verified Organizers', value: '350+', icon: Shield, color: 'text-emerald-400' },
    { label: 'Active Volunteers', value: '1,400+', icon: UserCheck, color: 'text-cyan-400' },
    { label: 'Registrations', value: '180,000+', icon: TrendingUp, color: 'text-rose-400' },
  ];

  return (
    <section id="stats" className="py-20 border-y border-zinc-800/60 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Live Platform Impact Metrics
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-2">Real-time statistics across active university and enterprise hubs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsList.map((s, i) => (
              <motion.div
                key={s.label}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-2 cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center mx-auto ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className={`text-2xl font-black tracking-tight ${s.color}`}>{s.value}</p>
                <p className="text-xs font-bold text-zinc-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── STEP 4: FEATURES SECTION ── */
function Features() {
  const featureList = [
    { icon: Brain, title: 'AI Event Assistant', desc: 'Auto-generate 6-stage schedules, volunteer roles, FAQs, and marketing copy.', pill: 'AI Copilot' },
    { icon: QrCode, title: 'QR Code Check-in', desc: 'Instant gate check-in via mobile camera scanner with HMAC security.', pill: 'Security' },
    { icon: Activity, title: 'Real-time Notifications', desc: 'Instant Socket.IO alerts for task updates, schedule changes, and alerts.', pill: 'Socket.IO' },
    { icon: Shield, title: 'Multi-role Dashboards', desc: 'Tailored views for Admin, Organizer, Attendee, and Volunteer roles.', pill: 'Access' },
    { icon: Calendar, title: 'Event Registration', desc: 'Seamless seat reservations, waitlists, and instant ticket pass delivery.', pill: 'Portal' },
    { icon: UserCheck, title: 'Volunteer Management', desc: 'Skill-matched task allocations, check-in tracking, and duty logs.', pill: 'Roster' },
    { icon: BarChart2, title: 'Real-Time Analytics', desc: 'Executive dashboard metric cards, capacity meters, and check-in rates.', pill: 'Analytics' },
    { icon: Mail, title: 'Email Notifications', desc: 'Non-blocking HTML email dispatches for confirmations, passes, and updates.', pill: 'Automated' },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              Full Suite Capabilities
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight mt-3">
              Everything Needed for Modern Event Success
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureList.map((f, i) => (
              <motion.div
                key={f.title}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/30 transition-all cursor-default flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {f.pill}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── STEP 5: HOW IT WORKS (4-STEP WORKFLOW) ── */
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Create Account', desc: 'Sign up securely as an Attendee, Volunteer, or Organizer with role permissions.' },
    { num: '02', title: 'Browse Events', desc: 'Explore AI-curated events, tech summits, hackathons, and volunteer drives.' },
    { num: '03', title: 'Secure QR Pass', desc: 'Receive instant HMAC signed digital ticket pass with email confirmation.' },
    { num: '04', title: 'Attend & Claim Certificate', desc: 'Scan pass at venue gate and receive verified completion certificates.' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              Simple 4-Step Workflow
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight mt-3">
              How Anjaneya Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={scaleIn}
                custom={i}
                className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 relative space-y-3"
              >
                <span className="text-3xl font-black text-amber-500 font-mono">{s.num}</span>
                <h3 className="text-base font-extrabold text-white">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── STEP 6: WHY CHOOSE OUR PLATFORM ── */
function WhyChoose() {
  const advantages = [
    { title: 'Cryptographic Signed QR Passes', desc: 'HMAC SHA-256 tokens prevent forgery, duplicate entry, or pass tampering.' },
    { title: 'Non-Blocking Async Email System', desc: 'Fast HTML email dispatches without slowing down controller response times.' },
    { title: 'Multi-LLM AI Copilot Suite', desc: 'Leverages Gemini & GPT-4o for event blueprints and volunteer allocation.' },
    { title: 'Real-Time Socket.IO Synchronization', desc: 'Live attendance counter updates across dashboards without page refresh.' },
    { title: '100% Mobile Responsive', desc: 'Flawless camera QR scanning and navigation across phones and tablets.' },
    { title: 'Executive Report Export Engine', desc: 'Export platform data cleanly to CSV, Excel, and printable PDF documents.' },
  ];

  return (
    <section id="why-us" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-white tracking-tight">
              Why Choose Anjaneya Platform?
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-2">Built with enterprise security, speed, and real-time reliability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                variants={scaleIn}
                custom={i}
                className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Advantage
                </div>
                <h3 className="text-base font-extrabold text-white">{adv.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── STEP 7: TESTIMONIALS SECTION ── */
function Testimonials() {
  const reviews = [
    { name: 'Aditya Kulkarni', role: 'Event Lead, MIT Pune', quote: 'Anjaneya cut our gate check-in time from 45 mins to under 3 mins with QR scanning!', stars: 5 },
    { name: 'Priya Sharma', role: 'Volunteer Coordinator', quote: 'Managing 80 volunteers across 12 zones is seamless now with real-time duty alerts.', stars: 5 },
    { name: 'Rohan Verma', role: 'IIT Bombay Student', quote: 'I scanned my QR pass and got my certificate notification directly in my inbox!', stars: 5 },
    { name: 'Sneha Reddy', role: 'NGO Project Director', quote: 'The executive report export engine allowed us to generate PDF event rosters instantly.', stars: 5 },
    { name: 'Kiran Mehta', role: 'Cultural Fest Organizer', quote: 'The AI assistant generated a 2-day event timetable and budget draft in 10 seconds.', stars: 5 },
    { name: 'Diya Nair', role: 'Hackathon Manager', quote: 'Zero page refreshes! Capacity updates happen live via Socket.IO across all screens.', stars: 5 },
  ];

  return (
    <section id="testimonials" className="py-24 bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              Verified Feedback
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight mt-3">
              Trusted by Organizers & Attendees
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                variants={scaleIn}
                custom={i}
                className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 cursor-default"
              >
                <div className="flex text-amber-400 gap-1">
                  {[...Array(r.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">"{r.quote}"</p>
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-xs font-extrabold text-white">{r.name}</p>
                  <p className="text-[10px] font-semibold text-zinc-400">{r.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── STEP 8: EXPANDABLE FAQ ACCORDION ── */
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = [
    { q: 'How does QR Code ticket check-in work?', a: 'Upon event registration, attendees receive an HMAC SHA-256 signed QR pass. Organizers scan it using the dedicated camera scanner page at the venue gate.' },
    { q: 'Is email notification dispatch non-blocking?', a: 'Yes. Email dispatches run asynchronously in background queues so controller responses return immediately without lag.' },
    { q: 'Which user roles are supported in Anjaneya?', a: 'Anjaneya supports Admin, Organizer, Attendee, and Volunteer roles with dedicated dashboards and permissions.' },
    { q: 'Can I export event and attendance reports?', a: 'Yes! Administrators can export clean reports in CSV, Excel (.xls), and printable PDF formats.' },
    { q: 'What happens if external SMTP credentials are missing?', a: 'The service automatically switches to a Development Fallback Driver that logs dispatches safely without throwing errors.' },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight mt-3">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  openIdx === i ? 'bg-zinc-900 border-amber-500/30' : 'bg-zinc-900/60 border-zinc-800'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs font-extrabold text-white cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openIdx === i ? 'rotate-180 text-amber-500' : ''}`} />
                </button>
                {openIdx === i && (
                  <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── STEP 9: FOOTER ── */
function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="text-[11px] font-medium text-zinc-400">© 2026 Anjaneya Platform. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats" className="hover:text-white transition-colors">Stats</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition-colors">
            <IconTwitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition-colors">
            <IconGithub className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition-colors">
            <IconLinkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ── MAIN LANDING PAGE COMPONENT ── */
export default function LandingPage() {
  const navigate = useNavigate();
  const goToApp = () => navigate('/login');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans">
      <Navbar onNavigate={goToApp} />
      <Hero onNavigate={goToApp} />
      <Statistics />
      <Features />
      <HowItWorks />
      <WhyChoose />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
