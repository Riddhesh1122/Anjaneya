import { motion } from "framer-motion";
import { UserCheck, Star } from "lucide-react";
import {
  Panel,
  SectionHeading,
  StatusBadge,
  statusTone,
  AIActionButton,
  Skeleton,
} from "@/components/ui/primitives";

export interface Volunteer {
  name: string;
  role: string;
  score: string;
  status: string;
  skills: string[];
}

export const volunteers: Volunteer[] = [
  { name: "Aarav Sharma", role: "Check-in Lead", score: "96%", status: "Assigned", skills: ["Registration", "React"] },
  { name: "Priya Patel", role: "AV Stage Setup", score: "91%", status: "Confirmed", skills: ["AV Sound", "Logistics"] },
  { name: "Rohan Verma", role: "Speaker Liaison", score: "88%", status: "Pending", skills: ["Public Relations", "Python"] },
  { name: "Meera Iyer", role: "Hospitality Desk", score: "84%", status: "Confirmed", skills: ["Guest Care", "Hindi"] },
];

export default function VolunteerOverview({
  loading = false,
  onAIAction,
  compact = false,
}: {
  loading?: boolean;
  onAIAction: (label: string) => void;
  compact?: boolean;
}) {
  const list = compact ? volunteers.slice(0, 3) : volunteers;

  return (
    <Panel className="p-5 sm:p-6">
      <SectionHeading
        title="Volunteer overview"
        subtitle="AI-matched crew for the next 7 days"
        icon={<UserCheck className="size-4" />}
        actions={
          <AIActionButton label="Assign Volunteers" onClick={() => onAIAction("Assign Volunteers")} />
        }
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border p-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-3 h-3 w-2/3" />
            </div>
          ))}

        {!loading &&
          list.map((vol, i) => (
            <motion.div
              key={vol.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="card-lift rounded-2xl border border-border bg-surface p-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-[11px] font-bold text-accent">
                    {vol.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{vol.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{vol.role}</p>
                  </div>
                </div>
                <StatusBadge tone={statusTone(vol.status)} dot>
                  {vol.status}
                </StatusBadge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success">
                  <Star className="size-3" />
                  {vol.score} fit
                </span>
                {vol.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
      </div>
    </Panel>
  );
}
