import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#5B21B6] to-[#7C3AED] px-4 py-10 text-white">
      <div className="mx-auto max-w-xl rounded-3xl bg-white/10 p-10 shadow-2xl shadow-black/20 backdrop-blur-lg">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Need help?</p>
          <h1 className="text-3xl font-semibold">Forgot password</h1>
          <p className="text-sm text-slate-200">
            No worries. This is a placeholder page while the password recovery UI is prepared.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center">
          <p className="text-sm text-slate-200">Please return to the login page to continue.</p>
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

export default ForgotPassword;
