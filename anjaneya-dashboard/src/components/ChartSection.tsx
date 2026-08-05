import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Panel, SectionHeading, AIActionButton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const registrationData = [
  { name: "Jan", registrations: 4000, volunteers: 2400 },
  { name: "Feb", registrations: 3000, volunteers: 1398 },
  { name: "Mar", registrations: 5000, volunteers: 3800 },
  { name: "Apr", registrations: 4780, volunteers: 3908 },
  { name: "May", registrations: 5890, volunteers: 4800 },
  { name: "Jun", registrations: 6390, volunteers: 3800 },
  { name: "Jul", registrations: 7490, volunteers: 4300 },
  { name: "Aug", registrations: 8200, volunteers: 5100 },
  { name: "Sep", registrations: 7800, volunteers: 4900 },
  { name: "Oct", registrations: 9100, volunteers: 5600 },
  { name: "Nov", registrations: 8700, volunteers: 5200 },
  { name: "Dec", registrations: 10200, volunteers: 6100 },
];

const categoryData = [
  { name: "Hackathons", value: 38 },
  { name: "Workshops", value: 26 },
  { name: "Summits", value: 21 },
  { name: "Meetups", value: 15 },
];

const attendanceData = [
  { name: "Mon", checkins: 320 },
  { name: "Tue", checkins: 410 },
  { name: "Wed", checkins: 380 },
  { name: "Thu", checkins: 520 },
  { name: "Fri", checkins: 610 },
  { name: "Sat", checkins: 780 },
  { name: "Sun", checkins: 540 },
];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

interface TooltipPayload {
  color?: string;
  name?: string | number;
  value?: string | number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl border border-border px-3.5 py-2.5 shadow-lift">
      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

export default function ChartSection({ onAIAction }: { onAIAction?: (label: string) => void }) {
  const [range, setRange] = useState<"6M" | "12M">("12M");
  const data = range === "6M" ? registrationData.slice(-6) : registrationData;

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Main area chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="xl:col-span-2"
      >
        <Panel className="p-5 sm:p-6">
          <SectionHeading
            title="Registrations & volunteer growth"
            subtitle="Signups compared with matched volunteers"
            actions={
              <>
                <div className="flex rounded-xl border border-border bg-surface p-0.5">
                  {(["6M", "12M"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "cursor-pointer rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-colors",
                        range === r
                          ? "bg-primary-soft text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <AIActionButton
                  label="Predict Attendance"
                  onClick={() => onAIAction?.("Predict Attendance")}
                />
              </>
            }
          />

          <div className="mt-6 h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradVolunteers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2.5}
                  fill="url(#gradRegistrations)"
                />
                <Area
                  type="monotone"
                  dataKey="volunteers"
                  name="Volunteers"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  fill="url(#gradVolunteers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </motion.div>

      {/* Category donut */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <Panel className="h-full p-5 sm:p-6">
          <SectionHeading title="Event mix" subtitle="Share by category" />
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[11px] text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </motion.div>

      {/* Weekly check-ins */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="xl:col-span-3"
      >
        <Panel className="p-5 sm:p-6">
          <SectionHeading
            title="Weekly check-ins"
            subtitle="On-site attendance captured by the check-in desk"
            actions={
              <AIActionButton
                label="Summarize Feedback"
                onClick={() => onAIAction?.("Summarize Feedback")}
              />
            }
          />
          <div className="mt-6 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} content={<CustomTooltip />} />
                <Bar
                  dataKey="checkins"
                  name="Check-ins"
                  fill="var(--color-chart-2)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}
