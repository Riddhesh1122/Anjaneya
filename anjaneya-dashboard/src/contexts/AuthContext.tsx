import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import api, { setStoredToken } from "@/services/api";

export type AppRole = "student" | "organizer" | "admin" | "volunteer";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  avatar: string | null;
  role: AppRole;
  /** true when this session is backed by a real JWT from the backend, false in offline demo mode */
  isBackendSession: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (details: {
    name: string;
    email: string;
    password: string;
    college?: string;
    role: "student" | "organizer" | "volunteer";
  }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function titleCaseFromEmail(email: string) {
  return email
    .split("@")[0]!
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Authentication provider.
 *
 * Tries a real login against the event-management-hackathon backend
 * (POST /api/auth/login) first, storing the returned JWT so subsequent
 * API calls (registrations, tasks, attendance) are authenticated.
 *
 * If the backend is unreachable or MongoDB is offline, this transparently
 * falls back to the original mock behavior (accepts any email containing
 * "@" with a 6+ char password) so the dashboard's demo mode keeps working
 * exactly as before.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<{
        token: string;
        user: { id: string; name: string; email: string; role: AppRole };
      }>("/auth/login", { email, password });

      setStoredToken(data.token);
      const authUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: null,
        role: data.user.role,
        isBackendSession: true,
      };
      setUser(authUser);
      setIsLoading(false);
      return authUser;
    } catch (backendErr) {
      // Backend not reachable / MongoDB offline / no account yet — fall back
      // to demo mode so the dashboard remains fully usable without a backend.
      if (!(email.includes("@") && password.length >= 6)) {
        const err = "Invalid email or password (min 6 chars)";
        setError(err);
        setIsLoading(false);
        throw new Error(err);
      }
      setStoredToken(null);
      const mockUser: AuthUser = {
        name: titleCaseFromEmail(email),
        email,
        avatar: null,
        role: "organizer",
        isBackendSession: false,
      };
      setUser(mockUser);
      setIsLoading(false);
      return mockUser;
    }
  }, []);

  const register = useCallback(
    async (details: {
      name: string;
      email: string;
      password: string;
      college?: string;
      role: "student" | "organizer" | "volunteer";
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.post<{
          token: string;
          user: { id: string; name: string; email: string; role: AppRole };
        }>("/auth/register", details);

        setStoredToken(data.token);
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: null,
          role: data.user.role,
          isBackendSession: true,
        };
        setUser(authUser);
        setIsLoading(false);
        return authUser;
      } catch (err) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          "Could not create account. Is the backend running?";
        setError(message);
        setIsLoading(false);
        throw new Error(message);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setStoredToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
