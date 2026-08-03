import { apiClient, unwrapApiResponse, getApiErrorMessage } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  role?: string;
  college?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function loginWithApi(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const payload = unwrapApiResponse<LoginResponse>(response.data);
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    }
    return payload;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Login failed'));
  }
}

export async function registerWithApi(userData: { name?: string; email: string; password: string; college?: string; role?: string }) {
  try {
    const response = await apiClient.post('/auth/signup', userData);
    const payload = unwrapApiResponse<LoginResponse>(response.data);
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    }
    return payload;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Registration failed'));
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.get('/auth/me');
    return unwrapApiResponse<AuthUser>(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load profile'));
  }
}
