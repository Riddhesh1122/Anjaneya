// src/services/user.service.ts
import { apiClient, ApiResponse } from './apiClient';
import { User } from '../types/User';
import { users } from '../mocks/users';

/**
 * Mock user service for fetching and updating user profiles.
 */
export const userService = {
  /** Fetch a user by id */
  getUser(id: string): Promise<ApiResponse<User | undefined>> {
    const user = users.find((u) => u.id === id);
    return apiClient.get(user, user ? 'User fetched' : 'User not found');
  },

  /** Update a user's profile (mock – mutates the in‑memory array) */
  updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User | undefined>> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return apiClient.get(undefined, 'User not found');
    }
    const updated = { ...users[index], ...updates } as User;
    users[index] = updated;
    return apiClient.mutate(updated, 'User updated');
  },
};
