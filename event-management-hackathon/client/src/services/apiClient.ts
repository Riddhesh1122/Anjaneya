// src/services/apiClient.ts
/**
 * A lightweight mock API client that mimics real HTTP calls.
 * All methods return a Promise that resolves after a short delay
 * with a standardized response shape:
 *   { success: boolean; message: string; data: unknown }
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

function simulateDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const apiClient = {
  /**
   * Simulate a GET request.
   */
  get<T>(data: T, message = 'Fetched successfully'): Promise<ApiResponse<T>> {
    return simulateDelay({ success: true, message, data });
  },

  /**
   * Simulate a POST/PUT/DELETE request.
   */
  mutate<T>(data: T, message = 'Operation successful'): Promise<ApiResponse<T>> {
    return simulateDelay({ success: true, message, data });
  },
};
