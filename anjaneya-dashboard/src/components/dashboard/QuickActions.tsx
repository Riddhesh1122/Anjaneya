import { motion } from "framer-motion";
import {
  CalendarPlus,
  UserPlus,
  Mail,
  Award,
  FileText,
  QrCode,
  type LucideIcon,
} from "lucide-react";
import { Panel, SectionHeading } from "@/components/ui/primitives";

const actions: { label: string; hint: string; icon: LucideIcon; mode: string }[] = [
  { label: "New event", hint: "Draft in 30s", icon: CalendarPlus, mode: "event" },
  { label: "Assign volunteers", hint: "Skill matching", icon: UserPlus, mode: "volunteer" },
  { label: "Send email", hint: "AI drafted", icon: Mail, mode: "email" },
  { label: "Certificates", hint: "Bulk generate", icon: Award, mode: "certificate" },
  { label: "FAQ builder", hint: "From details", icon: FileText, mode: "faq" },
  { label: "Check-in QR", hint: "On-site desk", icon: QrCode, mode: "event" },
];

export default function QuickActions({ onAction }: { onAction: (mode: string) => void }) {
  return (
    <Panel className="p-5 sm:p-6">
      <SectionHeading title="Quick actions" subtitle="Your most-used workflows" />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            onClick={() => onAction(action.mode)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group flex cursor-pointer flex-col items-start gap-2 rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-primary/35"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary transition-transform duration-200 group-hover:scale-110">
              <action.icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-foreground">
                {action.label}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">{action.hint}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </Panel>
  );
}
