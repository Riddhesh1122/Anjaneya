import axios from "axios";

// Base URL for the Express + MongoDB backend (event-management-hackathon).
// Falls back to localhost:3001 (the backend's default PORT) when unset.
const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:3001";

export const AUTH_TOKEN_KEY = "anjaneya_auth_token";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // localStorage unavailable (SSR / private mode) — non-fatal.
  }
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
