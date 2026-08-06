import api from "./api";

/**
 * Thin wrappers around the event-management-hackathon Express backend.
 * Every function fails soft (returns null / [] and never throws past this
 * module) so the dashboard's existing demo-mode UI keeps working if the
 * backend or MongoDB is unreachable — same "offline mode" contract the
 * backend itself already implements.
 */

export interface BackendRegistration {
  _id: string;
  user: string;
  event: string | { _id: string; title: string; startAt?: string; venue?: string };
  status: "registered" | "cancelled";
  checkedInAt: string | null;
  checkedOutAt: string | null;
  createdAt?: string;
}

export interface BackendTask {
  _id: string;
  title: string;
  description?: string;
  event: string | { _id: string; title: string };
  assignedVolunteer: string | { _id: string; name: string; email: string } | null;
  status: "unassigned" | "assigned" | "in_progress" | "done";
}

export interface BackendEvent {
  _id: string;
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  venue?: string;
  college?: string;
  category?: string;
  capacity?: number;
  status?: string;
}

export interface AttendanceSummary {
  eventId: string;
  registered: number;
  checkedIn: number;
  checkedOut: number;
  notArrived: number;
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalRegistrations: number;
  checkedIn: number;
  checkedOut: number;
  totalVolunteers: number;
  totalTasks: number;
  completedTasks: number;
}

// ---------------- Events ----------------

/** Returns [] (never throws) when the backend is unreachable, so callers can
 * fall back to the dashboard's existing local demo events unchanged. */
export async function getEvents(): Promise<BackendEvent[]> {
  try {
    const { data } = await api.get<BackendEvent[]>("/events");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("getEvents failed", err);
    return [];
  }
}

/** Maps a backend Event document onto the frontend's existing EventItem shape
 * (see components/dashboard/UpcomingEvents.tsx) so it can be rendered by the
 * unmodified UI. */
export function mapBackendEventToItem(ev: BackendEvent): {
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
} {
  const startDate = ev.startAt ? new Date(ev.startAt) : null;
  const isValidDate = !!startDate && !Number.isNaN(startDate.getTime());
  const today = new Date();
  const isToday = isValidDate && startDate!.toDateString() === today.toDateString();

  return {
    id: ev._id,
    title: ev.title,
    category: ev.category || "General",
    date: isValidDate
      ? startDate!.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Date TBD",
    location: ev.venue || ev.college || "TBD",
    attendees: 0,
    description: ev.description || "",
    isToday,
    price: 0,
    isFree: true,
    needsVolunteers: true,
  };
}

/** Creates an event on the backend (organizer/admin only — the backend enforces
 * this via JWT role). Returns null (never throws) on failure so callers can keep
 * their existing local/demo-mode fallback. */
export async function createEvent(payload: {
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  venue?: string;
  college?: string;
  category?: string;
  capacity?: number;
}): Promise<BackendEvent | null> {
  try {
    const { data } = await api.post<BackendEvent>("/events", payload);
    return data;
  } catch (err) {
    console.warn("createEvent failed", err);
    return null;
  }
}

export async function updateEvent(
  eventId: string,
  payload: Partial<BackendEvent>,
): Promise<BackendEvent | null> {
  try {
    const { data } = await api.put<BackendEvent>(`/events/${eventId}`, payload);
    return data;
  } catch (err) {
    console.warn("updateEvent failed", err);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    await api.delete(`/events/${eventId}`);
    return true;
  } catch (err) {
    console.warn("deleteEvent failed", err);
    return false;
  }
}

// ---------------- Registrations ----------------

export async function registerForEvent(eventId: string): Promise<BackendRegistration | null> {
  try {
    const { data } = await api.post<BackendRegistration>("/registrations", { event: eventId });
    return data;
  } catch (err) {
    console.warn("registerForEvent failed", err);
    return null;
  }
}

export async function getMyRegistrations(): Promise<BackendRegistration[]> {
  try {
    const { data } = await api.get<BackendRegistration[]>("/registrations/my");
    return data;
  } catch (err) {
    console.warn("getMyRegistrations failed", err);
    return [];
  }
}

export async function cancelRegistration(registrationId: string): Promise<boolean> {
  try {
    await api.delete(`/registrations/${registrationId}`);
    return true;
  } catch (err) {
    console.warn("cancelRegistration failed", err);
    return false;
  }
}

export async function getRegistrationQr(registrationId: string): Promise<string | null> {
  try {
    const { data } = await api.get<{ qr: string }>(`/registrations/${registrationId}/qr`);
    return data.qr;
  } catch (err) {
    console.warn("getRegistrationQr failed", err);
    return null;
  }
}

export async function checkInRegistration(registrationId: string): Promise<BackendRegistration | null> {
  try {
    const { data } = await api.post<BackendRegistration>(`/registrations/${registrationId}/checkin`);
    return data;
  } catch (err) {
    console.warn("checkInRegistration failed", err);
    return null;
  }
}

export async function checkOutRegistration(registrationId: string): Promise<BackendRegistration | null> {
  try {
    const { data } = await api.post<BackendRegistration>(`/registrations/${registrationId}/checkout`);
    return data;
  } catch (err) {
    console.warn("checkOutRegistration failed", err);
    return null;
  }
}

// ---------------- Tasks / Volunteers ----------------

export async function getTasks(eventId?: string): Promise<BackendTask[]> {
  try {
    const { data } = await api.get<BackendTask[]>("/tasks", { params: eventId ? { event: eventId } : undefined });
    return data;
  } catch (err) {
    console.warn("getTasks failed", err);
    return [];
  }
}

export async function createTask(payload: {
  title: string;
  description?: string;
  event: string;
  assignedVolunteer?: string;
}): Promise<BackendTask | null> {
  try {
    const { data } = await api.post<BackendTask>("/tasks", payload);
    return data;
  } catch (err) {
    console.warn("createTask failed", err);
    return null;
  }
}

export async function assignTask(taskId: string, assignedVolunteer: string | null): Promise<BackendTask | null> {
  try {
    const { data } = await api.patch<BackendTask>(`/tasks/${taskId}`, { assignedVolunteer });
    return data;
  } catch (err) {
    console.warn("assignTask failed", err);
    return null;
  }
}

export async function updateTaskStatus(taskId: string, status: BackendTask["status"]): Promise<BackendTask | null> {
  try {
    const { data } = await api.patch<BackendTask>(`/tasks/${taskId}`, { status });
    return data;
  } catch (err) {
    console.warn("updateTaskStatus failed", err);
    return null;
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    await api.delete(`/tasks/${taskId}`);
    return true;
  } catch (err) {
    console.warn("deleteTask failed", err);
    return false;
  }
}

// ---------------- Attendance ----------------

export async function getEventAttendance(eventId: string): Promise<AttendanceSummary | null> {
  try {
    const { data } = await api.get<AttendanceSummary>(`/events/${eventId}/attendance`);
    return data;
  } catch (err) {
    console.warn("getEventAttendance failed", err);
    return null;
  }
}

// ---------------- Dashboard stats ----------------

/** Organizer/admin-only aggregate counts for the home dashboard. Returns null
 * (never throws) when unauthorized, unreachable, or the user isn't staff. */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const { data } = await api.get<DashboardStats>("/stats/dashboard");
    return data;
  } catch (err) {
    console.warn("getDashboardStats failed", err);
    return null;
  }
}
