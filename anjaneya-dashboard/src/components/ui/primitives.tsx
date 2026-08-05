import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- */
/* Surface                                                          */
/* ---------------------------------------------------------------- */

export function Panel({
  children,
  className,
  glass = false,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border shadow-card",
        glass ? "glass" : "border-border bg-card",
        hover && "card-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Badges                                                           */
/* ---------------------------------------------------------------- */

export type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "error";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary-soft text-primary border-primary/20",
  accent: "bg-accent-soft text-accent border-accent/20",
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  error: "bg-destructive-soft text-destructive border-destructive/25",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "active", "approved", "success"].includes(s)) return "success";
  if (["pending", "away", "waiting", "medium"].includes(s)) return "warning";
  if (["failed", "cancelled", "high", "critical"].includes(s)) return "error";
  if (["in progress", "assigned", "running"].includes(s)) return "primary";
  return "neutral";
}

/* ---------------------------------------------------------------- */
/* Buttons                                                          */
/* ---------------------------------------------------------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "soft" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
};

const variantClasses = {
  primary:
    "bg-brand-gradient text-primary-foreground shadow-glow hover:brightness-[1.06] border border-transparent",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent",
  outline: "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-muted",
  soft: "border border-primary/20 bg-primary-soft text-primary hover:brightness-[0.98]",
  danger: "border border-destructive/25 bg-destructive-soft text-destructive hover:brightness-[0.98]",
} as const;

export function Button({
  children,
  className,
  variant = "outline",
  size = "md",
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/** AI action pill used across the whole product surface. */
export function AIActionButton({
  label,
  onClick,
  className,
  size = "sm",
}: {
  label: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-accent/25 bg-accent-soft font-semibold text-accent transition-colors hover:border-accent/50",
        size === "sm" ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs",
        className,
      )}
    >
      <Sparkles className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </motion.button>
  );
}

/* ---------------------------------------------------------------- */
/* Loading skeletons                                                */
/* ---------------------------------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

export function CardSkeleton() {
  return (
    <Panel className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="size-11 rounded-2xl" />
      </div>
    </Panel>
  );
}
