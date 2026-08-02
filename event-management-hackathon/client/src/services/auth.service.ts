// src/services/auth.service.ts
import { apiClient, ApiResponse } from './apiClient';
import { User } from '../types/User';
import { users } from '../mocks/users';
import { Role } from '../types/Role';

/**
 * Mock authentication service.
 * In a real app this would communicate with a backend.
 */
export const authService = {
  /**
   * Simulate login with email.
   * Returns the first user matching the email, or a Guest fallback.
   */
  login(email: string): Promise<ApiResponse<User>> {
    const user = users.find((u) => u.email === email) ?? {
      id: 'guest',
      createdAt: new Date().toISOString(),
      name: 'Guest User',
      email,
      role: Role.GUEST,
    };
    return apiClient.get(user, 'Login successful');
  },

  /**
   * Simulate registration of a new user.
   */
  register(newUser: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    const id = `u${users.length + 1}`;
    const user: User = {
      id,
      createdAt: new Date().toISOString(),
      ...newUser,
    };
    // In mock we just push to the array.
    (users as User[]).push(user);
    return apiClient.mutate(user, 'Registration successful');
  },

  /**
   * Get current user by id (mocked).
   */
  getUser(id: string): Promise<ApiResponse<User | undefined>> {
    const user = users.find((u) => u.id === id);
    return apiClient.get(user, user ? 'User fetched' : 'User not found');
  },
};
