// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { applyThemeToRoot } from '../theme';

/** Theme mode selected by the user */
export type ThemeMode = 'system' | 'light' | 'dark';
/** Resolved theme after applying system preference */
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextProps {
  /** Stored mode */
  theme: ThemeMode;
  /** Actual theme applied (light/dark) */
  resolvedTheme: ResolvedTheme;
  /** Change stored mode */
  setTheme: (mode: ThemeMode) => void;
  /** Toggle between light/dark when not "system" */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/** Read persisted theme from localStorage */
const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' || stored === 'system' ? (stored as ThemeMode) : 'system';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Load persisted theme on mount
  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  // Update resolved theme whenever `theme` changes or system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const compute = () => {
      const resolved: ResolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      applyThemeToRoot(resolved === 'dark');
    };
    compute();
    media.addEventListener('change', compute);
    return () => media.removeEventListener('change', compute);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', mode);
    }
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : prev === 'light' ? 'dark' : 'dark'));
  }, [setTheme]);

  const value: ThemeContextProps = { theme, resolvedTheme, setTheme, toggleTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** Hook to access theme context */
export const useTheme = (): ThemeContextProps => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
