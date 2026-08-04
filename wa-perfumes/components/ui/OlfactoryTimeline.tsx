'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface OlfactoryTimelineProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  accentColor?: string;
}

export function OlfactoryTimeline({
  topNotes,
  heartNotes,
  baseNotes,
  accentColor = 'var(--color-gold)'
}: OlfactoryTimelineProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="relative py-4">
      {/* Vertical Line */}
      <div 
        className="absolute left-[24px] top-6 bottom-4 w-[1px]" 
        style={{ backgroundColor: accentColor, opacity: 0.3 }}
      />

      <motion.div
        className="flex flex-col gap-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        {/* Top Notes */}
        <motion.div variants={itemVariants} className="relative flex flex-row items-start gap-6 group">
          <div className="w-12 flex justify-center relative">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--color-bg)] relative z-10 mt-0.5">
              <div className="absolute inset-0 m-auto h-[26px] w-[26px] rounded-full" style={{ backgroundColor: accentColor, opacity: 0.15 }} />
              <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </div>
          </div>
          <div className="flex-1 pt-1.5">
            <h3 className="text-[0.55rem] uppercase tracking-[0.3em] mb-1 text-[var(--color-text-muted)] font-sans">
              Notes de Tête
            </h3>
            <p className="font-serif italic text-lg text-[var(--color-text)]">
              {topNotes.join(', ')}
            </p>
          </div>
        </motion.div>

        {/* Heart Notes */}
        <motion.div variants={itemVariants} className="relative flex flex-row items-start gap-6 group">
          <div className="w-12 flex justify-center relative">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--color-bg)] relative z-10 mt-0.5">
              <div className="absolute inset-0 m-auto h-[26px] w-[26px] rounded-full" style={{ backgroundColor: accentColor, opacity: 0.15 }} />
              <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 pt-1.5">
            <h3 className="text-[0.55rem] uppercase tracking-[0.3em] mb-1 text-[var(--color-text-muted)] font-sans">
              Notes de Cœur
            </h3>
            <p className="font-serif italic text-lg text-[var(--color-text)]">
              {heartNotes.join(', ')}
            </p>
          </div>
        </motion.div>

        {/* Base Notes */}
        <motion.div variants={itemVariants} className="relative flex flex-row items-start gap-6 group">
          <div className="w-12 flex justify-center relative">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--color-bg)] relative z-10 mt-0.5">
              <div className="absolute inset-0 m-auto h-[26px] w-[26px] rounded-full" style={{ backgroundColor: accentColor, opacity: 0.15 }} />
              <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 pt-1.5">
            <h3 className="text-[0.55rem] uppercase tracking-[0.3em] mb-1 text-[var(--color-text-muted)] font-sans">
              Notes de Fond
            </h3>
            <p className="font-serif italic text-lg text-[var(--color-text)]">
              {baseNotes.join(', ')}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OlfactoryTimeline;
