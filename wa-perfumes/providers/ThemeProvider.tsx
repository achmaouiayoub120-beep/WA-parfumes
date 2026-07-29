'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial read
    try {
      const stored = localStorage.getItem('wa-theme') as Theme;
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        setThemeState(stored);
      }
    } catch (e) {}
    
    // Read the initially applied theme from the HTML tag to sync immediately
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') {
      setResolvedTheme(current);
    }
    
    setMounted(true);
    
    // Enable transitions after mount to prevent FOUC
    const timer = setTimeout(() => {
      document.documentElement.classList.add('theme-transition');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const applyTheme = (newTheme: Theme) => {
      const isDark = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const active = isDark ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', active);
      setResolvedTheme(active);
      
      try {
        localStorage.setItem('wa-theme', newTheme);
      } catch (e) {}
    };

    applyTheme(theme);
    
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}
