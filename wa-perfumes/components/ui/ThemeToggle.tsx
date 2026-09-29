'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, setThemeAnimated, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return <div className="w-9 h-9" />;
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    if (setThemeAnimated) {
      setThemeAnimated(isDark ? 'light' : 'dark', undefined);
    } else {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-500 group"
      style={{
        borderColor: 'var(--color-border)',
        background: 'var(--color-accent-bg-subtle)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'var(--color-accent-bg-hover)' }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          /* Sun icon — shown in dark mode (click to go light) */
          <motion.svg
            key="sun"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
            style={{ color: 'var(--color-accent)' }}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>
        ) : (
          /* Moon icon — shown in light mode (click to go dark) */
          <motion.svg
            key="moon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
            style={{ color: 'var(--color-accent)' }}
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
