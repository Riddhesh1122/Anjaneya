import { apiClient, unwrapApiResponse, getApiErrorMessage } from './apiClient';

export type Volunteer = {
  id: string;
  name: string;
  role?: string;
  skills: string[];
  availability: string;
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

const toVolunteer = (volunteer: any): Volunteer => ({
  id: volunteer.id || volunteer._id,
  name: volunteer.name || 'Volunteer',
  role: volunteer.role || 'volunteer',
  skills: volunteer.skills || ['Support'],
  availability: volunteer.availability || 'Flexible',
  assignedEvent: volunteer.assignedEvent || '',
  completionPercent: volunteer.completionPercent || 70,
  email: volunteer.email,
  phone: volunteer.phone,
  avatar: volunteer.avatar,
  experience: volunteer.experience,
  certificates: volunteer.certificates,
});

const toTask = (task: any): Task => ({
  id: task.id || task._id,
  title: task.title,
  description: task.description || '',
  volunteerId: task.volunteerId || null,
  priority: task.priority || 'Medium',
  dueDate: task.dueDate || '',
  event: task.event || '',
  status: task.status || 'Pending',
  notes: task.notes || '',
});

export async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const response = await apiClient.get('/volunteers');
    const payload = unwrapApiResponse<any[]>(response.data);
    return (Array.isArray(payload) ? payload : []).map(toVolunteer);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load volunteers'));
  }
}

export async function getVolunteer(id: string): Promise<Volunteer | null> {
  try {
    const response = await apiClient.get(`/volunteers/${id}`);
    const payload = unwrapApiResponse<any>(response.data);
    return payload ? toVolunteer(payload) : null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load volunteer'));
  }
}

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await apiClient.get('/tasks');
    const payload = unwrapApiResponse<any[]>(response.data);
    return (Array.isArray(payload) ? payload : []).map(toTask);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load tasks'));
  }
}

export async function createTask(payload: Omit<Task, 'id'>): Promise<Task> {
  try {
    const response = await apiClient.post('/tasks', {
      title: payload.title,
      description: payload.description,
      volunteerId: payload.volunteerId || null,
      priority: payload.priority,
      dueDate: payload.dueDate,
      event: payload.event,
      status: payload.status,
      notes: payload.notes,
    });
    const taskPayload = unwrapApiResponse<any>(response.data);
    return toTask(taskPayload);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to create task'));
  }
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task | null> {
  try {
    const response = await apiClient.put(`/tasks/${id}`, patch);
    const payload = unwrapApiResponse<any>(response.data);
    return payload ? toTask(payload) : null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to update task'));
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/tasks/${id}`);
    return true;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to delete task'));
  }
}

export async function assignVolunteer(taskId: string, volunteerId: string | null): Promise<Task | null> {
  return updateTask(taskId, { volunteerId });
}

export default {
  getVolunteers,
  getVolunteer,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  assignVolunteer,
};
