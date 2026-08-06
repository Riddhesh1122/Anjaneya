import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import {
  Panel,
  SectionHeading,
  StatusBadge,
  statusTone,
  AIActionButton,
  Skeleton,
} from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

interface ActivityRow {
  id: number;
  user: string;
  action: string;
  date: string;
  status: string;
}

const initialData: ActivityRow[] = [
  { id: 1, user: "Alice Johnson", action: "Created new event draft", date: "2026-08-03", status: "Completed" },
  { id: 2, user: "Bob Smith", action: "Updated volunteer roster", date: "2026-08-03", status: "Completed" },
  { id: 3, user: "Carol Davis", action: "Invited 12 team members", date: "2026-08-02", status: "Pending" },
  { id: 4, user: "Dave Wilson", action: "Published hackathon schedule", date: "2026-08-02", status: "Completed" },
  { id: 5, user: "Eve Martinez", action: "Submitted support ticket", date: "2026-08-01", status: "In Progress" },
  { id: 6, user: "Frank Lee", action: "Generated monthly report", date: "2026-07-31", status: "Completed" },
  { id: 7, user: "Grace Kim", action: "Approved certificate batch", date: "2026-07-31", status: "Completed" },
  { id: 8, user: "Hari Menon", action: "Reassigned AV crew", date: "2026-07-30", status: "In Progress" },
  { id: 9, user: "Isha Rao", action: "Flagged duplicate signups", date: "2026-07-30", status: "Pending" },
  { id: 10, user: "Jon Alvarez", action: "Exported attendee list", date: "2026-07-29", status: "Completed" },
];

const PAGE_SIZE = 5;
const statuses = ["All", "Completed", "In Progress", "Pending"];

export default function ActivityTable({
  loading = false,
  onAIAction,
}: {
  loading?: boolean;
  onAIAction?: (label: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sortKey, setSortKey] = useState<keyof ActivityRow>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const filtered = initialData.filter((row) => {
      const matchesQuery =
        !query ||
        row.user.toLowerCase().includes(query.toLowerCase()) ||
        row.action.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" || row.status === status;
      return matchesQuery && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [query, status, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key: keyof ActivityRow) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const columns: [keyof ActivityRow, string][] = [
    ["user", "User"],
    ["action", "Action"],
    ["date", "Date"],
    ["status", "Status"],
  ];

  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-border p-5 sm:p-6">
        <SectionHeading
          title="Recent activity"
          subtitle="Latest actions across your event workspace"
          actions={
            <AIActionButton
              label="Summarize Feedback"
              onClick={() => onAIAction?.("Summarize Feedback")}
            />
          }
        />

        <div className="mt-4 grid gap-2 sm:flex sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search activity…"
              className="w-full rounded-xl border border-border bg-surface py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  status === s
                    ? "border-primary/25 bg-primary-soft text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              {columns.map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="cursor-pointer px-6 py-3 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {label}
                    <ArrowUpDown
                      className={cn("size-3", sortKey === key ? "text-primary" : "opacity-40")}
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {columns.map(([key]) => (
                      <td key={key} className="px-6 py-4">
                        <Skeleton className="h-4 w-full max-w-40" />
                      </td>
                    ))}
                  </tr>
                ))
              : paged.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/60"
                  >
                    <td className="px-6 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-[11px] font-bold text-primary">
                          {row.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                        <span className="truncate text-sm font-medium text-foreground">
                          {row.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{row.action}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{row.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge tone={statusTone(row.status)} dot>
                        {row.status}
                      </StatusBadge>
                    </td>
                  </motion.tr>
                ))}
            {!loading && paged.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No activity matches your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border px-6 py-4">
        <p className="truncate text-xs text-muted-foreground">
          Showing {paged.length} of {rows.length} activities
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={cn(
                "size-8 cursor-pointer rounded-lg text-xs font-semibold transition-colors",
                currentPage === i + 1
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </Panel>
  );
}
