'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  setThemeAnimated: (theme: Theme, rect?: DOMRect) => void;
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

  const setThemeAnimated = (newTheme: Theme, rect?: DOMRect) => {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setThemeState(newTheme);
      return;
    }

    const isDark = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Create the circle overlay
    const overlay = document.createElement('div');
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    
    // Calculate the distance to the furthest corner to get the max radius
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '999999'; // Very high to cover everything during transition
    overlay.style.backgroundColor = isDark ? '#0A0A0A' : '#FAFAFA'; // Background colors of the themes
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    
    document.body.appendChild(overlay);

    // Animate the circle reveal
    const animation = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: 600,
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // easeInOutCubic
        fill: 'forwards'
      }
    );

    animation.onfinish = () => {
      // Actually switch the theme underneath the overlay
      setThemeState(newTheme);
      
      // Give a tiny moment for DOM to update with new theme, then fade out the overlay
      setTimeout(() => {
        const fadeOut = overlay.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 400, easing: 'ease' }
        );
        
        fadeOut.onfinish = () => {
          overlay.remove();
        };
      }, 50);
    };
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState, setThemeAnimated }}>
      {children}
    </ThemeContext.Provider>
  );
}
