import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import Logo from '../components/Logo';

export default function LoginPage() {
  const { login, register, isLoading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState(false);
  const [exiting, setExiting] = useState(false);

  /* ---------- Validation ---------- */
  const validate = useCallback(() => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (isSignUp && password.length < 6) errs.password = 'Min 6 characters required';
    if (isSignUp && !name) errs.name = 'Full name is required';
    return errs;
  }, [email, password, name, isSignUp]);

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setErrors({});
    try {
      if (isSignUp) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
      setExiting(true);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setErrors({ submit: err.message || 'Authentication failed. Please check your credentials.' });
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const bg = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const cardBg = isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';
  const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden ${bg}`}
    >
      {/* ─── AMBIENT BACKGROUND GLOWS ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-amber-500/10 blur-[130px]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[140px]" />
      </div>

      {/* ─── CENTERED LOGO & BRANDING HEADER ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-8 text-center flex flex-col items-center"
      >
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-xs font-semibold text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm transition-all cursor-pointer"
        >
          ← Back to Landing Page
        </button>
        
        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-amber-500/30 backdrop-blur-md shadow-xl shadow-amber-500/10 mb-3">
          <Logo size="xl" showText={true} />
        </div>
        <p className={`text-xs font-medium max-w-sm mx-auto ${textMuted}`}>
          Centralized Event & Volunteer Management AI Platform
        </p>
      </motion.div>

      {/* ─── CENTERED AUTHENTICATION CARD ─── */}
      <motion.div
        className={`w-full max-w-md p-8 rounded-3xl border ${cardBg} backdrop-blur-2xl shadow-2xl relative z-10 ${shaking ? 'animate-shake' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <h2 className="text-2xl font-black tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className={`text-xs mt-1 ${textMuted}`}>
            {isSignUp
              ? 'Get started with AI-driven event management'
              : 'Sign in to access your Anjaneya dashboard'}
          </p>
        </motion.div>

        {/* Form error banner */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium text-center"
            >
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (Sign up only) */}
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  leftIcon={<UserIcon className="w-4 h-4" />}
                  error={errors.name}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <Input
              label="Password"
              isPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
            />
          </motion.div>

          {/* Remember me + Forgot password */}
          {!isSignUp && (
            <motion.div variants={itemVariants} className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500/30"
                />
                <span className={textMuted}>Remember me</span>
              </label>
              <button type="button" className="text-amber-500 hover:text-amber-400 font-medium transition-colors cursor-pointer">
                Forgot password?
              </button>
            </motion.div>
          )}

          {/* Submit button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center shadow-lg shadow-amber-500/25"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 my-5">
          <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
          <span className={`text-[10px] uppercase font-semibold tracking-wider ${textMuted}`}>or</span>
          <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        </motion.div>

        {/* Social login buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5">
          <Button variant="outline" size="md" className="justify-center">
            Google
          </Button>
          <Button variant="outline" size="md" className="justify-center">
            GitHub
          </Button>
        </motion.div>

        {/* Toggle Sign-Up / Login */}
        <motion.p variants={itemVariants} className={`text-center text-xs mt-6 ${textMuted}`}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }}
            className="text-amber-500 hover:text-amber-400 font-semibold transition-colors cursor-pointer"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
