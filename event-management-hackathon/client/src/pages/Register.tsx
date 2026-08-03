import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#5B21B6] to-[#7C3AED] px-4 py-10 text-white">
      <div className="mx-auto max-w-xl rounded-3xl bg-white/10 p-10 shadow-2xl shadow-black/20 backdrop-blur-lg">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Join Anjaneya</p>
          <h1 className="text-3xl font-semibold">Register your account</h1>
          <p className="text-sm text-slate-200">
            The registration flow is coming soon. For now, you can return to the login page.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center">
          <p className="text-sm text-slate-200">We&apos;re preparing a smooth sign-up experience.</p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
