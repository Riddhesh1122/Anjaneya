import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CalendarDays,
  MapPin,
  Type,
  AlignLeft,
  Users,
  Ticket,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { Panel, SectionHeading, Button, AIActionButton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  type?: string;
  textarea?: boolean;
}

/** Floating-label input with icon and inline validation state. */
function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const shared = {
    id,
    value,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    placeholder: " ",
    className: cn(
      "w-full rounded-2xl border bg-surface pt-6 pb-2 pl-11 pr-4 text-sm text-foreground outline-none transition-colors",
      error
        ? "border-destructive/60 focus:border-destructive"
        : "border-border focus:border-primary/60 focus:ring-2 focus:ring-ring/20",
      textarea && "min-h-28 resize-y",
    ),
  };

  return (
    <div>
      <div className="relative">
        <Icon
          className={cn(
            "pointer-events-none absolute left-4 size-4 transition-colors",
            textarea ? "top-6" : "top-1/2 -translate-y-1/2",
            error ? "text-destructive" : focused ? "text-primary" : "text-muted-foreground",
          )}
        />
        {textarea ? <textarea {...shared} /> : <input type={type} {...shared} />}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-11 origin-left transition-all duration-200",
            floated
              ? "top-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
              : textarea
                ? "top-5 text-sm text-muted-foreground"
                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
          )}
        >
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-destructive"
          >
            <AlertCircle className="size-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const steps = ["Basics", "Logistics", "Capacity"];

export interface EventWizardValues {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: string;
  price: string;
}

export default function EventWizard({
  onLaunchAI,
  onSubmitted,
}: {
  onLaunchAI: () => void;
  onSubmitted?: (values: EventWizardValues) => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    price: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof values) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (values.title.trim().length < 4) next["title"] = "Give the event a name (min 4 characters)";
      if (values.description.trim().length < 12)
        next["description"] = "Add a short summary attendees will read";
    }
    if (step === 1) {
      if (!values.date) next["date"] = "Pick a start date";
      if (values.location.trim().length < 3) next["location"] = "Where is it happening?";
    }
    if (step === 2) {
      if (!values.capacity || Number(values.capacity) <= 0)
        next["capacity"] = "Capacity must be greater than zero";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step === steps.length - 1) {
      setDone(true);
      onSubmitted?.(values);
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <Panel className="p-5 sm:p-6">
      <SectionHeading
        title="Create an event"
        subtitle="Three quick steps — or let AI draft it for you"
        actions={<AIActionButton label="Optimize Event" onClick={onLaunchAI} />}
      />

      {/* Stepper */}
      <div className="mt-6 flex items-center">
        {steps.map((label, i) => (
          <div key={label} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors",
                  i < step || done
                    ? "border-transparent bg-success text-success-foreground"
                    : i === step
                      ? "border-transparent bg-brand-gradient text-primary-foreground"
                      : "border-border text-muted-foreground",
                )}
              >
                {i < step || done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate text-xs font-semibold sm:block",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "mx-3 h-px min-w-4 flex-1 transition-colors",
                  i < step || done ? "bg-success" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-success/25 bg-success-soft p-6 text-center"
        >
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-success text-success-foreground">
            <Check className="size-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground">Draft ready for review</p>
          <p className="mt-1 text-xs text-muted-foreground">
            “{values.title}” has been added to your event drafts.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setDone(false);
              setStep(0);
              setValues({ title: "", description: "", date: "", location: "", capacity: "", price: "" });
            }}
          >
            Create another
          </Button>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="mt-6 grid gap-4"
            >
              {step === 0 && (
                <>
                  <Field
                    id="title"
                    label="Event title"
                    icon={Type}
                    value={values.title}
                    onChange={set("title")}
                    error={errors["title"]}
                  />
                  <Field
                    id="description"
                    label="Short description"
                    icon={AlignLeft}
                    textarea
                    value={values.description}
                    onChange={set("description")}
                    error={errors["description"]}
                  />
                </>
              )}
              {step === 1 && (
                <>
                  <Field
                    id="date"
                    label="Start date"
                    type="date"
                    icon={CalendarDays}
                    value={values.date}
                    onChange={set("date")}
                    error={errors["date"]}
                  />
                  <Field
                    id="location"
                    label="Venue or link"
                    icon={MapPin}
                    value={values.location}
                    onChange={set("location")}
                    error={errors["location"]}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <Field
                    id="capacity"
                    label="Attendee capacity"
                    type="number"
                    icon={Users}
                    value={values.capacity}
                    onChange={set("capacity")}
                    error={errors["capacity"]}
                  />
                  <Field
                    id="price"
                    label="Ticket price (leave empty for free)"
                    type="number"
                    icon={Ticket}
                    value={values.price}
                    onChange={set("price")}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              icon={<ArrowLeft className="size-4" />}
            >
              Back
            </Button>
            <Button variant="primary" onClick={next}>
              {step === steps.length - 1 ? "Publish draft" : "Continue"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </>
      )}
    </Panel>
  );
}
