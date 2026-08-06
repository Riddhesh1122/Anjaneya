import { motion } from "framer-motion";
import { CalendarClock, MapPin, Users, Check } from "lucide-react";
import {
  Panel,
  SectionHeading,
  StatusBadge,
  AIActionButton,
  Button,
  Skeleton,
} from "@/components/ui/primitives";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  isToday: boolean;
  price: number;
  isFree: boolean;
  needsVolunteers: boolean;
}

export default function UpcomingEvents({
  events,
  loading = false,
  onAIAction,
  showRegister = false,
  registeredEventIds = [],
  registeringEventId = null,
  onRegister,
}: {
  events: EventItem[];
  loading?: boolean;
  onAIAction: (label: string, eventTitle?: string) => void;
  /** Show a "Register" action per event (attendee-facing). Off by default so existing views are unchanged. */
  showRegister?: boolean;
  registeredEventIds?: string[];
  registeringEventId?: string | null;
  onRegister?: (eventId: string) => void;
}) {
  return (
    <Panel className="p-5 sm:p-6">
      <SectionHeading
        title="Upcoming events"
        subtitle="Next sessions on the calendar"
        icon={<CalendarClock className="size-4" />}
        actions={
          <AIActionButton label="Generate Schedule" onClick={() => onAIAction("Generate Schedule")} />
        }
      />

      <div className="mt-5 space-y-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-3 w-1/2" />
            </div>
          ))}

        {!loading &&
          events.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="card-lift rounded-2xl border border-border bg-surface p-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">{event.title}</h3>
                    {event.isToday && (
                      <StatusBadge tone="success" dot>
                        Today
                      </StatusBadge>
                    )}
                    {event.needsVolunteers && (
                      <StatusBadge tone="warning">Needs volunteers</StatusBadge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="size-3.5" />
                      {event.date}
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      {event.attendees} attending
                    </span>
                  </div>
                </div>
                <StatusBadge tone={event.isFree ? "primary" : "accent"}>
                  {event.isFree ? "Free" : `$${event.price}`}
                </StatusBadge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                {showRegister && onRegister && (
                  <Button
                    variant={registeredEventIds.includes(event.id) ? "soft" : "primary"}
                    size="sm"
                    disabled={registeredEventIds.includes(event.id) || registeringEventId === event.id}
                    onClick={() => onRegister(event.id)}
                  >
                    {registeredEventIds.includes(event.id) ? (
                      <>
                        <Check className="size-3.5" />
                        Registered
                      </>
                    ) : registeringEventId === event.id ? (
                      "Registering..."
                    ) : (
                      "Register"
                    )}
                  </Button>
                )}
                <AIActionButton
                  label="Optimize Event"
                  onClick={() => onAIAction("Optimize Event", event.title)}
                />
                <AIActionButton
                  label="Assign Volunteers"
                  onClick={() => onAIAction("Assign Volunteers", event.title)}
                />
                <AIActionButton
                  label="Predict Attendance"
                  onClick={() => onAIAction("Predict Attendance", event.title)}
                />
              </div>
            </motion.article>
          ))}

        {!loading && events.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No events match your search.
          </p>
        )}
      </div>
    </Panel>
  );
}
