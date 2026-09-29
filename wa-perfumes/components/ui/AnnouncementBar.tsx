'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dismissed the bar in this session
    const dismissed = sessionStorage.getItem('wa-announcement-dismissed');
    if (dismissed) setVisible(false);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('wa-announcement-dismissed', 'true');
  };

  if (!mounted || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
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
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-2.5 flex items-center justify-center gap-4">
            <Link
              href="/#pack-decouverte"
              className="flex items-center gap-3 group"
            >
              <span
                className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] md:tracking-[0.3em] font-[family-name:var(--font-sans)]"
                style={{ color: 'var(--color-accent)' }}
              >
                Nouveau
              </span>
              <span
                className="hidden sm:inline-block w-[1px] h-3"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
              <span
                className="text-[0.6rem] md:text-[0.65rem] tracking-[0.15em] md:tracking-[0.2em] font-[family-name:var(--font-sans)] transition-colors duration-300"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Pack Découverte 5×30ml —{' '}
                <span style={{ color: 'var(--color-accent)' }} className="font-medium">
                  199 DH
                </span>
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: 'var(--color-accent)' }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-1 transition-colors duration-300"
              style={{ color: 'var(--color-text-subtle)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-subtle)')}
              aria-label="Dismiss announcement"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
