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
      className={`min-h-screen flex ${bg}`}
    >
      {/* ─── LEFT PANEL: Branded Hero ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-700 items-center justify-center p-12">
        <div className="relative z-10 text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 p-4 rounded-3xl bg-zinc-950/40 backdrop-blur-md border border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <Logo size="xl" showText={false} />
            </div>
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">ANJANEYA</h1>
            <p className="text-sm font-medium text-amber-100/90 leading-relaxed max-w-md mx-auto">
              Centralized Event & Volunteer Management AI Platform. Seamless registration, smart volunteer matching, and instant copilot analytics.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Authentication Form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div
          className={`w-full max-w-md p-8 rounded-2xl border ${cardBg} backdrop-blur-xl ${shaking ? 'animate-shake' : ''}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
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
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium"
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
                <button type="button" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
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
                className="w-full justify-center"
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
      </div>
    </motion.div>
  );
}
