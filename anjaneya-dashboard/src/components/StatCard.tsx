import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "accent" | "success" | "warning";

const toneMap: Record<Tone, { icon: string; spark: string }> = {
  primary: { icon: "bg-primary-soft text-primary", spark: "text-primary" },
  accent: { icon: "bg-accent-soft text-accent", spark: "text-accent" },
  success: { icon: "bg-success-soft text-success", spark: "text-success" },
  warning: { icon: "bg-warning-soft text-warning", spark: "text-warning" },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  tone?: Tone;
  caption?: string;
  spark?: number[];
  delay?: number;
}

function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 26 - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn("h-8 w-24", className)}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp = true,
  tone = "primary",
  caption,
  spark,
  delay = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || typeof value !== "number") return;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, value]);

  const formatted = typeof value === "string" ? value : displayValue.toLocaleString();
  const c = toneMap[tone];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card-lift rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
            {formatted}
          </p>
        </div>
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", c.icon)}>
          {icon}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
                trendUp ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
              )}
            >
              {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend}
            </span>
          ) : null}
          {caption ? (
            <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{caption}</p>
          ) : null}
        </div>
        {spark ? <Sparkline points={spark} className={cn("shrink-0", c.spark)} /> : null}
      </div>
    </motion.div>
  );
}
