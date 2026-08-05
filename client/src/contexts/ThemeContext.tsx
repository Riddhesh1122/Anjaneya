import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('anjaneya-theme') !== 'light'; } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('anjaneya-theme', isDark ? 'dark' : 'light'); } catch {}
    document.documentElement.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(v => !v) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
