'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function AnnouncementBar() {
  const mounted = useIsMounted();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('wa-announcement-dismissed') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (mounted && !dismissed) {
      document.documentElement.style.setProperty('--announce-h', '38px');
    } else {
      document.documentElement.style.setProperty('--announce-h', '0px');
    }
    return () => {
      document.documentElement.style.setProperty('--announce-h', '0px');
    };
  }, [mounted, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('wa-announcement-dismissed', 'true');
    } catch {}
    document.documentElement.style.setProperty('--announce-h', '0px');
  };

  if (!mounted || dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 38, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-[102] overflow-hidden"
          style={{
            height: '38px',
            backgroundColor: 'var(--color-accent-bg-subtle)',
            borderBottom: '1px solid var(--color-border)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-2">
            <div className="w-8 shrink-0" aria-hidden="true" />

            <Link
              href="/#pack-decouverte"
              className="flex items-center justify-center gap-2 sm:gap-3 group truncate py-1"
            >
              <span
                className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] font-semibold px-1.5 py-0.5 rounded-sm"
                style={{ 
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-muted)'
                }}
              >
                Nouveau
              </span>
              <span
                className="text-[0.65rem] sm:text-xs tracking-[0.12em] font-medium truncate"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Pack Découverte 5×30ml —{' '}
                <span style={{ color: 'var(--color-accent)' }} className="font-semibold">
                  199 DH
                </span>
              </span>
              <span
                className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: 'var(--color-accent)' }}
              >
                →
              </span>
            </Link>

            {/* Dismiss button — 44px min touch area */}
            <button
              onClick={handleDismiss}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
              aria-label="Fermer l'annonce"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
