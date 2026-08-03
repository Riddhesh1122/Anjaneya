import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { loginWithPlaceholderApi, LoginCredentials } from '../../services/authApi';

interface LoginFormProps {
  onSubmitSuccess?: () => void;
}

export const LoginForm = ({ onSubmitSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);

    try {
      await loginWithPlaceholderApi(data);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      window.setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Login failed', error);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/20">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Anjaneya</h1>
        <p className="mt-2 text-sm text-slate-500">Welcome back! Please sign in to continue.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <AnimatePresence mode="wait">
            {errors.email && (
              <motion.p
                key="email-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2 text-sm text-rose-600"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {errors.password && (
              <motion.p
                key="password-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2 text-sm text-rose-600"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-blue-600 transition hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M21.805 10.023h-9.77v3.955h5.616c-.242 1.29-.98 2.38-2.09 3.112v2.58h3.381c1.98-1.82 3.122-4.49 3.122-7.647 0-.64-.056-1.26-.14-1.85z"
              fill="#4285F4"
            />
            <path
              d="M12.035 22c2.82 0 5.19-.93 6.92-2.52l-3.38-2.58c-.93.63-2.13.99-3.54.99-2.72 0-5.02-1.84-5.84-4.32H2.75v2.71C4.47 19.57 7.92 22 12.035 22z"
              fill="#34A853"
            />
            <path
              d="M6.195 12.59c-.2-.64-.31-1.32-.31-2.02 0-.7.11-1.38.31-2.02V5.87H2.75C2.06 7.08 1.7 8.46 1.7 9.57c0 1.11.36 2.49 1.05 3.71l3.445-2.68z"
              fill="#FBBC05"
            />
            <path
              d="M12.035 5.65c1.53 0 2.91.53 3.99 1.56l2.99-2.99C17.225 2.38 14.855 1.2 12.035 1.2 7.92 1.2 4.47 3.63 2.75 6.87l3.445 2.68c.82-2.48 3.12-4.32 5.84-4.32z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 pt-2 text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm uppercase tracking-[0.22em]">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
            Register now
          </Link>
        </p>
      </form>

      <p className="mt-7 text-center text-xs uppercase tracking-[0.18em] text-slate-400">
        © 2026 Anjaneya
      </p>
    </motion.div>
  );
};
