import { motion } from 'framer-motion';
import { LoginForm } from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#5B21B6] to-[#7C3AED] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="grid min-h-[650px] lg:grid-cols-[1.1fr_0.9fr]">
            <section className="hidden flex-col justify-between bg-slate-950 px-8 py-10 text-white lg:flex">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">Welcome to Anjaneya</p>
                <h2 className="mt-6 text-4xl font-semibold leading-tight">
                  Build unforgettable events with a fresh, modern login experience.
                </h2>
                <p className="mt-5 max-w-lg text-base text-slate-300">
                  Securely sign in to manage registrations, schedules, and team access from one polished dashboard.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">Why teams choose Anjaneya</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li>• Fast access for organizers, volunteers, and attendees</li>
                  <li>• Clear event workflows with modern UI polish</li>
                  <li>• Responsive on desktop and mobile devices</li>
                </ul>
              </div>
            </section>

            <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10">
              <div className="w-full max-w-md">
                <LoginForm />
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default LoginPage;
