import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Sparkles, Zap } from "lucide-react";
import { AIActionButton } from "@/components/ui/primitives";

export default function HeroOverview({
  name,
  onCreateEvent,
  onAIAction,
}: {
  name: string;
  onCreateEvent: () => void;
  onAIAction: (label: string) => void;
}) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-brand-gradient opacity-[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-accent opacity-[0.08] blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {today}
          </span>

          <h1 className="mt-4 font-display text-2xl font-bold text-balance text-foreground sm:text-3xl lg:text-4xl">
            Welcome back, <span className="text-gradient">{name}</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Your AI copilot has reviewed 48 active events overnight — 3 need volunteer coverage and
            2 schedules can be optimised before registrations open.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={onCreateEvent}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-105"
            >
              <Sparkles className="size-4" />
              Create event with AI
            </button>
            <AIActionButton
              size="md"
              label="Optimize Event"
              onClick={() => onAIAction("Optimize Event")}
            />
            <AIActionButton
              size="md"
              label="Generate Schedule"
              onClick={() => onAIAction("Generate Schedule")}
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 lg:w-[300px]">
          {[
            { label: "Events live now", value: "6", icon: Zap, tone: "text-success" },
            { label: "Volunteer coverage", value: "92%", icon: ArrowUpRight, tone: "text-primary" },
            { label: "Tasks due today", value: "14", icon: CalendarDays, tone: "text-warning" },
            { label: "AI actions run", value: "231", icon: Sparkles, tone: "text-accent" },
          ].map((item) => (
            <div
              key={item.label}
              className="glass rounded-2xl p-3.5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <item.icon className={`size-4 ${item.tone}`} />
              <p className="mt-2 font-display text-xl font-bold text-foreground">{item.value}</p>
              <p className="truncate text-[11px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
