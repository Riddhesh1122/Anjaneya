import { Link } from 'react-router-dom';

const DashboardComingSoon = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-200">Dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold">Coming soon</h1>
        <p className="mt-3 text-base text-slate-300">
          The dashboard experience is being prepared. For now, you can return to the login experience.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default DashboardComingSoon;
