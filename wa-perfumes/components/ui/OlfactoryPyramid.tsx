'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OlfactoryPyramid({ top, heart, base }: { top: string; heart: string; base: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('.pyramid-item');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0.2, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative py-8 md:py-12 mb-6 w-full max-w-4xl mx-auto">
      {/* 3-Column Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 text-center">
        {/* Notes de Tête */}
        <div className="pyramid-item flex flex-col items-center gap-2.5 px-4 md:border-r md:border-[var(--color-border-subtle)]">
          <div className="w-8 h-8 rounded-full border border-[var(--color-silver)] flex items-center justify-center opacity-80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--color-silver)' }}>
              <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 18v4M16.24 16.24l2.83 2.83M18 12h4M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="text-[13px] uppercase tracking-[0.25em] text-[var(--color-silver)] font-medium">
            Notes de Tête
          </span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver)] to-transparent opacity-40 my-0.5" />
          <p className="font-[family-name:var(--font-cormorant)] text-[16px] md:text-[18px] text-[var(--color-text)] italic leading-relaxed">
            {top}
          </p>
        </div>

        {/* Notes de Cœur */}
        <div className="pyramid-item flex flex-col items-center gap-2.5 px-4 md:border-r md:border-[var(--color-border-subtle)]">
          <div className="w-8 h-8 rounded-full border border-[var(--color-silver)] flex items-center justify-center opacity-80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--color-silver)' }}>
              <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12 4 12 4S12.76 3 14.5 3C17.58 3 20 5.42 20 8.5C20 13.5 12 21 12 21Z" />
            </svg>
          </div>
          <span className="text-[13px] uppercase tracking-[0.25em] text-[var(--color-silver)] font-medium">
            Notes de Cœur
          </span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver)] to-transparent opacity-40 my-0.5" />
          <p className="font-[family-name:var(--font-cormorant)] text-[16px] md:text-[18px] text-[var(--color-text)] italic leading-relaxed">
            {heart}
          </p>
        </div>

        {/* Notes de Fond */}
        <div className="pyramid-item flex flex-col items-center gap-2.5 px-4">
          <div className="w-8 h-8 rounded-full border border-[var(--color-silver)] flex items-center justify-center opacity-80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--color-silver)' }}>
              <path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" />
              <path d="M12 14V22" />
            </svg>
          </div>
          <span className="text-[13px] uppercase tracking-[0.25em] text-[var(--color-silver)] font-medium">
            Notes de Fond
          </span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver)] to-transparent opacity-40 my-0.5" />
          <p className="font-[family-name:var(--font-cormorant)] text-[16px] md:text-[18px] text-[var(--color-text)] italic leading-relaxed">
            {base}
          </p>
        </div>
      </div>
    </div>
  );
}
