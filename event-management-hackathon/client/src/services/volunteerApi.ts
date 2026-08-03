import axios, { AxiosResponse } from 'axios';

export type Volunteer = {
  id: string;
  name: string;
  role?: string;
  skills: string[];
  availability: string; // e.g., 'Weekends', 'Weekdays'
  assignedEvent?: string;
  completionPercent: number;
  email?: string;
  phone?: string;
  avatar?: string;
  experience?: string;
  certificates?: string[];
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  volunteerId?: string | null;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  event?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
};

// In-memory mock store
let volunteers: Volunteer[] = [
  {
    id: 'v1',
    name: 'Priya Sharma',
    role: 'Volunteer',
    skills: ['Logistics', 'First Aid'],
    availability: 'Weekends',
    assignedEvent: 'Tech Meetup',
    completionPercent: 78,
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://i.pravatar.cc/150?img=32',
    experience: '2 years volunteering with local NGOs',
    certificates: ['First Aid Certificate']
  },
  {
    id: 'v2',
    name: 'Ravi Kumar',
    role: 'Coordinator',
    skills: ['Coordination', 'Crowd Management'],
    availability: 'Weekdays',
    assignedEvent: 'Music Fest',
    completionPercent: 92,
    email: 'ravi@example.com',
    phone: '+91 91234 56789',
    avatar: 'https://i.pravatar.cc/150?img=12',
    experience: '3 years event coordination',
    certificates: []
  },
  {
    id: 'v3',
    name: 'Anjali Rao',
    role: 'Volunteer',
    skills: ['Marketing', 'Photos'],
    availability: 'Weekends',
    assignedEvent: '',
    completionPercent: 45,
    email: 'anjali@example.com',
    phone: '+91 99876 54321',
    avatar: 'https://i.pravatar.cc/150?img=45',
    experience: 'Freelance photographer',
    certificates: ['Photography Basics']
  }
];

let tasks: Task[] = [
  {
    id: 't1',
    title: 'Set up stage',
    description: 'Assemble and test sound/lighting',
    volunteerId: 'v2',
    priority: 'High',
    dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    event: 'Music Fest',
    status: 'In Progress',
    notes: ''
  },
  {
    id: 't2',
    title: 'Ticket counter',
    description: 'Manage ticketing and entry',
    volunteerId: 'v1',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    event: 'Tech Meetup',
    status: 'Pending',
    notes: ''
  },
  {
    id: 't3',
    title: 'Social media updates',
    description: 'Post live updates during event',
    volunteerId: null,
    priority: 'Low',
    dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    event: 'Tech Meetup',
    status: 'Pending',
    notes: ''
  }
];

// Simulate network delay
const wait = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export async function getVolunteers(): Promise<Volunteer[]> {
  await wait(400);
  return [...volunteers];
}

export async function getVolunteer(id: string): Promise<Volunteer | null> {
  await wait(300);
  const v = volunteers.find((x) => x.id === id) || null;
  return v;
}

export async function getTasks(): Promise<Task[]> {
  await wait(400);
  return [...tasks];
}

export async function createTask(payload: Omit<Task, 'id'>): Promise<Task> {
  await wait(400);
  const newTask: Task = { id: `t${Date.now()}`, ...payload } as Task;
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task | null> {
  await wait(300);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...patch };
  return tasks[idx];
}

export async function deleteTask(id: string): Promise<boolean> {
  await wait(200);
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  return tasks.length < before;
}

export async function assignVolunteer(taskId: string, volunteerId: string | null): Promise<Task | null> {
  await wait(250);
  const t = tasks.find((x) => x.id === taskId);
  if (!t) return null;
  t.volunteerId = volunteerId;
  return t;
}

// Export default for potential axios-like usage
export default {
  getVolunteers,
  getVolunteer,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  assignVolunteer
};
