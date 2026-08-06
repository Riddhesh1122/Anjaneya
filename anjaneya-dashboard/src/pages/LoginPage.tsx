import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const highlights = [
  "AI-matched volunteer allocation in seconds",
  "Live registration analytics across every event",
  "One-click certificates, emails and FAQs",
];

const signupRoles: { value: "student" | "volunteer" | "organizer"; label: string }[] = [
  { value: "student", label: "Attendee" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organizer", label: "Organizer" },
];

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login, register, isLoading, error } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("organizer@anjaneya.dev");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [role, setRole] = useState<"student" | "volunteer" | "organizer">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!email.includes("@")) return setLocalError("Enter a valid email address");
    if (password.length < 6) return setLocalError("Password must be at least 6 characters");
    if (mode === "signup" && name.trim().length < 2) {
      return setLocalError("Enter your full name");
    }
    try {
      if (mode === "signup") {
        await register({ name: name.trim(), email, password, college: college.trim(), role });
      } else {
        await login(email, password);
      }
      onLoginSuccess();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const message = localError || error;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background lg:grid lg:grid-cols-2">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 size-[28rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 size-[26rem] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-glow">
            <Sparkles className="size-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">Anjaneya</span>
        </div>

        <div className="max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold leading-tight tracking-tight text-foreground"
          >
            The AI control room for national-scale events.
          </motion.h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Plan, staff and analyse hackathons, summits and workshops from a single premium
            workspace.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h, i) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <Check className="size-3" />
                </span>
                {h}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 Anjaneya Events Platform</p>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong w-full max-w-md rounded-3xl p-7 shadow-elevated sm:p-9"
        >
          <div className="flex items-center gap-3 lg:hidden">
            <span className="grid size-9 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-glow">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">Anjaneya</span>
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground lg:mt-0">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Sign up as an attendee, volunteer or organizer."
              : "Sign in to your organiser dashboard."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/20"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/20"
                  placeholder="you@organisation.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/20"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label htmlFor="college" className="mb-1.5 block text-xs font-semibold text-foreground">
                    College / organisation (optional)
                  </label>
                  <input
                    id="college"
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/20"
                    placeholder="MIT Tech"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">I am joining as</label>
                  <div className="grid grid-cols-3 gap-2">
                    {signupRoles.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={cn(
                          "cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                          role === r.value
                            ? "border-primary/60 bg-primary-soft text-primary"
                            : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {message}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className={cn("w-full justify-center", isLoading && "opacity-70")}
            >
              {isLoading ? (mode === "signup" ? "Creating account…" : "Signing in…") : mode === "signup" ? "Create account" : "Sign in"}
              {!isLoading && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "login" ? "signup" : "login"));
              setLocalError("");
            }}
            className="mt-4 w-full cursor-pointer text-center text-xs font-semibold text-primary hover:underline"
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            If the backend is unreachable, demo mode accepts any email with a 6+ character password.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
