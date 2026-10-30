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
  };

  if (!mounted || dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[101] overflow-hidden"
          style={{
            backgroundColor: 'var(--color-accent-bg-subtle)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-2 md:py-2.5 flex items-center justify-center gap-3 md:gap-4">
            <Link
              href="/#pack-decouverte"
              className="flex items-center gap-2 md:gap-3 group truncate"
            >
              <span
                className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] md:tracking-[0.3em] font-[family-name:var(--font-sans)] flex-shrink-0"
                style={{ color: 'var(--color-accent)' }}
              >
                Nouveau
              </span>
              <span
                className="hidden sm:inline-block w-[1px] h-3"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
              <span
                className="text-[0.6rem] md:text-[0.65rem] tracking-[0.12em] md:tracking-[0.2em] font-[family-name:var(--font-sans)] transition-colors duration-300 truncate"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Pack Découverte 5×30ml —{' '}
                <span style={{ color: 'var(--color-accent)' }} className="font-medium">
                  199 DH
                </span>
              </span>
              <span
                className="text-[0.55rem] uppercase tracking-[0.15em] transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0"
                style={{ color: 'var(--color-accent)' }}
              >
                →
              </span>
            </Link>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 md:w-auto md:h-auto flex items-center justify-center p-1 rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors flex-shrink-0"
              aria-label="Fermer l'annonce"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
