'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            delay: 0.3,
            onComplete: () => {
              setComplete(true);
              onComplete?.();
            },
          });
        },
      });

      // Fade in brand text
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.3
      );

      // Animate progress bar
      tl.to(
        progressRef.current,
        {
          scaleX: 1,
          duration: 2.2,
          ease: 'power2.inOut',
        },
        0.5
      );

      // Animate counter
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2.2,
          ease: 'power2.inOut',
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(this.targets()[0].val).toString();
            }
          },
        },
        0.5
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-[var(--color-bg)] flex flex-col items-center justify-center"
    >
      {/* Brand Title */}
      <div ref={textRef} className="text-center opacity-0">
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light tracking-[0.35em] uppercase text-[var(--color-text)] mb-10">
          WA Perfumes
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-48 md:w-64 relative">
        <div className="h-[1px] bg-[var(--color-border-subtle)] w-full" />
        <div
          ref={progressRef}
          className="absolute top-0 left-0 h-[1px] bg-[var(--color-gold)] w-full origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Counter */}
      <div className="mt-6 text-[0.65rem] tracking-[0.4em] text-[var(--color-text-subtle)] font-[family-name:var(--font-sans)]">
        <span ref={counterRef}>0</span>
        <span>%</span>
      </div>
    </div>
  );
}
