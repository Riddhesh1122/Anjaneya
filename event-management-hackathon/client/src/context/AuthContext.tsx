import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthRole } from '../types/auth';
import { getCurrentUser, loginWithApi, registerWithApi } from '../services/authApi';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: AuthRole;
  college?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name?: string; email: string; password: string; college?: string; role?: AuthRole }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser as User);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await loginWithApi({ email, password, rememberMe: true });
    setToken(data.token);
    setUser(data.user as User);
  };

  const register = async (userData: { name?: string; email: string; password: string; college?: string; role?: AuthRole }) => {
    const data = await registerWithApi(userData);
    setToken(data.token);
    setUser(data.user as User);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
