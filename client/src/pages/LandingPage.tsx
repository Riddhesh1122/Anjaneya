import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Calendar, UserCheck, BarChart2, Cpu, ArrowRight,
  CheckCircle2, ChevronDown,
  Zap, Globe, Shield, Award, Users, TrendingUp, MessageSquare,
  Star, Menu, X, QrCode, Brain, Layers, Activity
} from 'lucide-react';
import Logo from '../components/Logo';

/* ── Inline social icons (lucide-react version doesn't ship Github/Twitter/Linkedin) ── */
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


/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' }
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }
  }),
};

/* ─────────────────────────────────────────────────────────────
   SECTION WRAPPER — triggers animations on scroll into view
   ───────────────────────────────────────────────────────────── */
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className={className} data-inview={isInView ? 'true' : 'false'}>
      {children}
    </section>
  );
}

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

/* ─────────────────────────────────────────────────────────────
   BACKGROUND GRID — subtle dot matrix
   ───────────────────────────────────────────────────────────── */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #FF7A00 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Top-left amber orb */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
      {/* Bottom-right indigo orb */}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-[120px]" />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-indigo-900/20 blur-[120px]" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────────────────────── */
function Navbar({ onNavigate }: { onNavigate: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'AI Tools', href: '#ai' },
    { label: 'Stats', href: '#stats' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
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
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-amber-500/10 shadow-xl shadow-slate-950/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Logo size="lg" />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onNavigate}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNavigate}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold shadow-lg shadow-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer ring-2 ring-amber-500/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Dashboard →
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={onNavigate}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-sm font-bold text-center"
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

/* ─────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────── */
function Hero({ onNavigate }: { onNavigate: () => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const words = ['Events.', 'Volunteers.', 'Community.'];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setWordIdx((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-16">
      <GridBackground />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold mb-8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Hackathon 2026 — AI-Powered Platform
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-4"
        >
          Manage{' '}
          <span className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent block"
              >
                {words[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
          {' '}With AI.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Anjaneya is the AI-native event & volunteer management platform built for colleges, NGOs, and enterprises.
          From QR check-ins to real-time volunteer matching — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNavigate}
            className="group px-9 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-base shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all flex items-center gap-2.5 cursor-pointer ring-4 ring-amber-500/20 animate-pulse"
          >
            <Sparkles className="w-5 h-5 text-zinc-950" />
            Launch Dashboard Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 font-semibold text-sm hover:border-amber-500/40 hover:text-white backdrop-blur-sm transition-all"
          >
            Explore Features
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500"
        >
          <div className="flex -space-x-2">
            {['A','R','P','K','S'].map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: `hsl(${i * 60 + 20}, 70%, 45%)` }}
              >
                {c}
              </div>
            ))}
          </div>
          <span>Trusted by <strong className="text-slate-300">1,400+</strong> students, volunteers & organizers</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-slate-400">4.9 / 5</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Dashboard preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mt-20 max-w-5xl mx-auto w-full px-4"
      >
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-[0_40px_140px_rgba(0,0,0,0.8)] shadow-slate-950">
          {/* Mac-style window chrome */}
          <div className="h-10 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-md bg-slate-800/80 text-xs text-slate-500 font-mono">
                anjaneya.ai/dashboard
              </div>
            </div>
          </div>
          {/* Mockup content */}
          <div className="p-6 grid grid-cols-4 gap-4 min-h-[280px]">
            {/* Stats row */}
            {[
              { label: 'Active Events', val: '24', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
              { label: 'Volunteers', val: '1,482', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/20' },
              { label: 'Registrations', val: '8.6K', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
              { label: 'AI Accuracy', val: '98.4%', color: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/20' },
            ].map((s) => (
              <div key={s.label} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} border ${s.border}`}>
                <div className="text-xs text-slate-400 mb-2">{s.label}</div>
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-[10px] text-emerald-400 mt-1">↑ +12% this week</div>
              </div>
            ))}
            {/* Chart bar preview */}
            <div className="col-span-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
              <div className="text-xs text-slate-400 font-semibold">Event Registrations</div>
              <div className="flex-1 flex items-end gap-1.5">
                {[40,65,55,80,70,90,75,95,85,100,88,96].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.2 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    className={`flex-1 rounded-t-sm ${i === 9 ? 'bg-amber-500' : 'bg-slate-700/60'}`}
                  />
                ))}
              </div>
            </div>
            {/* AI panel */}
            <div className="col-span-2 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Recommendations
              </div>
              {['Match 3 volunteers to Hall A setup', 'Reminder: Event starts in 2 hours', 'Budget optimization: save ₹4,200'].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOGOS / TRUSTED BY
   ───────────────────────────────────────────────────────────── */
function TrustedBy() {
  const orgs = ['MIT Pune', 'COEP', 'NIT Nagpur', 'IIT Bombay', 'Symbiosis', 'PICT', 'VIT', 'BITS'];
  return (
    <AnimatedSection className="py-16 border-y border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p variants={fadeIn} className="text-center text-xs uppercase tracking-widest text-slate-600 mb-8 font-semibold">
          Trusted by students & organizers at
        </motion.p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {orgs.map((o, i) => (
            <motion.div
              key={o}
              variants={fadeIn}
              custom={i * 0.5}
              className="text-slate-600 text-sm font-bold tracking-wide hover:text-slate-400 transition-colors cursor-default"
            >
              {o}
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURES
   ───────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Calendar,
    title: 'Smart Event Management',
    desc: 'Create, publish, and track events with powerful filters. Support for hybrid, virtual, and in-person formats.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    pill: 'Organizer',
  },
  {
    icon: UserCheck,
    title: 'AI Volunteer Matching',
    desc: "Automatically match volunteers to roles based on their verified skills, availability, and past performance using Anjaneya's skill graph.",
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    pill: 'AI-Powered',
  },
  {
    icon: QrCode,
    title: 'QR Code Ticketing',
    desc: 'Issue digital QR passes instantly. Attendees scan at the gate — no paper, no queues, no friction.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    pill: 'Attendee',
  },
  {
    icon: BarChart2,
    title: 'Real-Time Analytics',
    desc: 'Live dashboards for registrations, attendance rates, volunteer completion %, and budget tracking.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    pill: 'Analytics',
  },
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    desc: 'Attendee, Volunteer, Organizer, Admin — each role sees exactly what they need with JWT-secured sessions.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    pill: 'Security',
  },
  {
    icon: Activity,
    title: 'Live Notifications',
    desc: 'Real-time alerts via Socket.IO — task assignments, low registration warnings, schedule changes, and more.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    pill: 'Real-Time',
  },
];

function Features() {
  return (
    <section id="features" className="py-28 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4 mx-auto">
              <Layers className="w-3.5 h-3.5" /> Platform Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight text-center">
              Everything you need to run{' '}
              <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">
                flawless events
              </span>
            </h2>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto text-center leading-relaxed">
              Purpose-built tools for every stakeholder — from organizers setting up the stage to volunteers checking in attendees.
            </p>
          </motion.div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <AnimatedSection key={f.title}>
              <motion.div
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group h-full p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/30 backdrop-blur-sm relative overflow-hidden transition-all cursor-default flex flex-col items-center text-center justify-between"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-500/5 to-indigo-600/5" />

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border mx-auto ${f.bg}`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>

                <div className="flex flex-col items-center gap-1.5 mb-3 w-full">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
                    {f.pill}
                  </span>
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors text-center">
                    {f.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed text-center mb-4">{f.desc}</p>

                <div className="mt-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   AI FEATURES
   ───────────────────────────────────────────────────────────── */
const aiFeatures = [
  {
    icon: Brain,
    title: 'Natural Language Event Generator',
    desc: 'Type a description in plain English and Anjaneya AI drafts a complete event — schedule, volunteer roles, budget estimate, and promotion copy.',
    badge: 'Gemini / GPT-4o / Groq',
  },
  {
    icon: UserCheck,
    title: 'Skill-Graph Volunteer Matching',
    desc: 'AI maps volunteer skills against event requirements and proposes optimal pairings with an explainable fit-score.',
    badge: 'AI Matching',
  },
  {
    icon: Sparkles,
    title: 'Smart Search & Discovery',
    desc: 'Semantic search across all events. Ask "free tech events this weekend in Pune" and get precise, ranked results.',
    badge: 'NLP Powered',
  },
  {
    icon: Award,
    title: 'Auto Certificate Generation',
    desc: 'Issue verified e-certificates to attendees and volunteers with a single click — personalized and digitally signed.',
    badge: 'Automation',
  },
];

function AIFeatures() {
  return (
    <section id="ai" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-indigo-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header */}
        <AnimatedSection>
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 mx-auto">
              <Cpu className="w-3.5 h-3.5" /> AI Suite
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 text-center">
              AI that actually{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
                does the work
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed text-center max-w-2xl mx-auto">
              Backed by multi-LLM routing — Gemini, OpenAI, Groq, and Pollinations — Anjaneya's AI adapts to your workflow, not the other way around.
            </p>
          </motion.div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: AI Capabilities */}
          <AnimatedSection>
            <div className="space-y-4">
              {aiFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i + 1}
                  whileHover={{ y: -2 }}
                  className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all group cursor-default"
                >
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
                    <f.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{f.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">{f.badge}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: AI Chat mockup */}
          <AnimatedSection>
            <motion.div
              variants={scaleIn}
              custom={0}
              className="relative rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl shadow-2xl shadow-slate-950/60 mx-auto max-w-lg lg:max-w-none"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-center gap-3 bg-slate-950/50">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white">Anjaneya AI Assistant</div>
                  <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> Online
                  </div>
                </div>
              </div>
              {/* Chat messages */}
              <div className="p-5 space-y-4 min-h-[340px]">
                {/* User */}
                <div className="flex justify-center sm:justify-end">
                  <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-sm text-center sm:text-right">
                    Generate a tech hackathon event for 200 participants next Saturday
                  </div>
                </div>
                {/* AI */}
                <div className="flex items-start gap-3 justify-center sm:justify-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="max-w-xs px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800 border border-slate-700 text-sm text-slate-200 space-y-2">
                    <p className="font-semibold text-amber-400">✦ AI Generated Event Draft</p>
                    <p><strong className="text-slate-300">Event:</strong> Global Code Sprint 2026</p>
                    <p><strong className="text-slate-300">Date:</strong> Saturday, Aug 9 · 9 AM – 10 PM</p>
                    <p><strong className="text-slate-300">Capacity:</strong> 200 participants · 12 judges</p>
                    <p><strong className="text-slate-300">Volunteers needed:</strong> 18 roles matched</p>
                    <p><strong className="text-slate-300">Budget estimate:</strong> ₹68,000</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold">Publish Event</button>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs">Edit Draft</button>
                    </div>
                  </div>
                </div>
                {/* Typing indicator */}
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800 border border-slate-700">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Input bar */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <input
                    readOnly
                    placeholder="Ask Anjaneya AI anything..."
                    className="flex-1 bg-transparent text-xs text-slate-400 placeholder-slate-600 outline-none text-center sm:text-left"
                  />
                  <button className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATS
   ───────────────────────────────────────────────────────────── */
const stats = [
  { label: 'Events Hosted', value: '2,400+', icon: Calendar, color: 'text-amber-400' },
  { label: 'Volunteers Matched', value: '14,800+', icon: UserCheck, color: 'text-indigo-400' },
  { label: 'Attendee Check-ins', value: '180,000+', icon: Users, color: 'text-emerald-400' },
  { label: 'AI Accuracy', value: '98.4%', icon: TrendingUp, color: 'text-rose-400' },
];

function Stats() {
  return (
    <section id="stats" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black text-white tracking-tight">
              Numbers that{' '}
              <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">speak for themselves</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/30 text-center group transition-all cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-400 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   TESTIMONIALS
   ───────────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: 'Aditya Kulkarni',
    role: 'Event Head, MIT Pune',
    avatar: 'AK',
    color: '#FF7A00',
    quote: "Anjaneya cut our check-in time from 45 minutes to under 3 minutes using QR scanning. The AI volunteer matching is genuinely magical.",
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Volunteer Coordinator, COEP',
    avatar: 'PS',
    color: '#4F46E5',
    quote: "Managing 80 volunteers across 12 event zones used to be a nightmare. Anjaneya's task board and real-time notifications changed everything.",
    stars: 5,
  },
  {
    name: 'Rohan Verma',
    role: 'CSE Student, IIT Bombay',
    avatar: 'RV',
    color: '#10B981',
    quote: "I signed up as an attendee, scanned my QR pass at the gate, and had my e-certificate in my inbox before I even reached home. Insane!",
    stars: 5,
  },
  {
    name: 'Sneha Joshi',
    role: 'NGO Project Lead',
    avatar: 'SJ',
    color: '#A855F7',
    quote: "We ran a national volunteer drive for 600+ people using Anjaneya. The organizer analytics dashboard gave us live insights we'd never had before.",
    stars: 5,
  },
  {
    name: 'Kiran Mehta',
    role: 'College Cultural Fest Head',
    avatar: 'KM',
    color: '#F43F5E',
    quote: "The AI event generator is the best feature. I typed 3 sentences and it spat out a full 2-day cultural fest blueprint with budget and volunteer roles.",
    stars: 5,
  },
  {
    name: 'Disha Patel',
    role: 'Hackathon Organizer',
    avatar: 'DP',
    color: '#06B6D4',
    quote: "Our judges loved the real-time leaderboard integration. Anjaneya handled everything from pre-event registration to post-event certificate issuance.",
    stars: 5,
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <MessageSquare className="w-3.5 h-3.5" /> What People Say
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Loved by event builders{' '}
              <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">across India</span>
            </h2>
          </motion.div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name}>
              <motion.div
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/25 transition-all group relative overflow-hidden cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />

                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.quote}"</p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: 'Is Anjaneya free to use?',
    a: "Yes! Anjaneya is completely free for students and small organizations. We're open-source and hackathon-built.",
  },
  {
    q: 'Which AI models does Anjaneya support?',
    a: 'Anjaneya supports Google Gemini, OpenAI GPT-4o, Groq (Llama 3), OpenRouter, and Pollinations as a zero-key fallback.',
  },
  {
    q: 'How does the QR Code ticketing work?',
    a: "After registering for an event, attendees receive a personalized QR Code digital pass. Organizers use Anjaneya's scan interface to check in attendees in real time.",
  },
  {
    q: "Can I integrate Anjaneya with my college's portal?",
    a: 'Yes — Anjaneya exposes a REST API and WebSocket interface. You can integrate event feeds, volunteer rosters, and analytics into any system.',
  },
  {
    q: 'How secure is user data?',
    a: 'All sessions are secured with JWT (HMAC-SHA256). Passwords are hashed with bcrypt. Role-based access control limits data visibility at every layer.',
  },
  {
    q: 'What is the Volunteer Skill Graph?',
    a: "It's an AI-maintained profile of each volunteer's verified skills, event history, and performance ratings. The matching engine uses it to suggest optimal role assignments.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Got questions?{' '}
              <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">We've got answers.</span>
            </h2>
          </motion.div>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <AnimatedSection key={f.q}>
              <motion.div
                variants={fadeUp}
                custom={i}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  open === i ? 'border-amber-500/30 bg-slate-900/80' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <span className={`text-sm font-semibold transition-colors ${open === i ? 'text-amber-400' : 'text-slate-200'}`}>
                    {f.q}
                  </span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONTACT / CTA BANNER
   ───────────────────────────────────────────────────────────── */
function Contact({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/8 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-600/10 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" /> Start for Free Today
          </motion.div>

          <motion.h2 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Ready to build{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
              your next event?
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} custom={2} className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join 1,400+ event organizers and volunteers already using Anjaneya to run smarter, faster, and more impactful events.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigate}
              className="group px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all flex items-center gap-2 cursor-pointer ring-4 ring-amber-500/20"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              Launch Dashboard Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <a
              href="mailto:hello@anjaneya.ai"
              className="px-8 py-4 rounded-2xl text-sm font-semibold text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
            >
              Contact Team →
            </a>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────── */
function Footer() {
  const footerLinks = {
    Platform: ['Events', 'Volunteers', 'Analytics', 'QR Tickets', 'Notifications'],
    AI: ['Event Generator', 'Volunteer Matcher', 'Smart Search', 'Certificate AI', 'LLM Settings'],
    Roles: ['Attendee', 'Volunteer', 'Organizer', 'Admin Portal', 'API Access'],
    Company: ['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'],
  };

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="md" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-[200px]">
              AI-powered event & volunteer management platform for modern organizers.
            </p>
            <div className="flex items-center gap-3">
              {[IconTwitter, IconGithub, IconLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-amber-500/40 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>© 2026 Anjaneya. Built for Hackathon 2026. Open-source & free to use.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN LANDING PAGE
   ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const goToApp = () => navigate('/login');

  // Prevent body scroll bleed on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden"
    >
      <Navbar onNavigate={goToApp} />
      <Hero onNavigate={goToApp} />
      <TrustedBy />
      <Features />
      <AIFeatures />
      <Stats />
      <Testimonials />
      <FAQ />
      <Contact onNavigate={goToApp} />
      <Footer />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ICON FIX — pull HelpCircle from the existing imports scope
   ───────────────────────────────────────────────────────────── */
function HelpCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
    </svg>
  );
}
