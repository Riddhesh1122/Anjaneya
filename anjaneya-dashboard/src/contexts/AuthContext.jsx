import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * Mock authentication provider.
 * Simulates login/logout with a setTimeout delay.
 * No real backend is needed — credentials are accepted if email contains '@'
 * and password is at least 6 characters.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      // Simulate network latency
      setTimeout(() => {
        if (email.includes('@') && password.length >= 6) {
          const mockUser = {
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            avatar: null,
          };
          setUser(mockUser);
          setIsLoading(false);
          resolve(mockUser);
        } else {
          const err = 'Invalid email or password (min 6 chars)';
          setError(err);
          setIsLoading(false);
          reject(err);
        }
      }, 1500);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
