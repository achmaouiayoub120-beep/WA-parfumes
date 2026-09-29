'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Preloader — SVG stroke-draw "WA" logo animation
 * 
 * - Draws the "WA" monogram in Cormorant Garamond style using SVG stroke paths
 * - Skip for returning visitors (sessionStorage check)
 * - Preloads hero images during animation
 * - Total duration: ~1.8s (first visit), 0s (return visit)
 * - Respects prefers-reduced-motion
 */
export default function Preloader({ onComplete }: { onComplete?: () => void } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [complete, setComplete] = useState(false);
  const [shouldSkip] = useState(() => {
    // Check if returning visitor — skip preloader entirely
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('wa-visited') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    // Mark as visited for future returns
    try {
      sessionStorage.setItem('wa-visited', 'true');
    } catch {}

    // Preload hero images during preloader animation
    const heroImages = [
      '/images/hero/hero-bg.jpg',
      '/images/hero/hero-smoke.png',
    ];
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // If returning visitor, complete immediately
    if (shouldSkip) {
      setComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Check reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      // Instant completion for reduced motion
      setTimeout(() => {
        setComplete(true);
        if (onComplete) onComplete();
      }, 100);
      return;
    }

    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll('.wa-stroke-path');
      if (!paths) return;

      // Prepare stroke-dashoffset for each path
      paths.forEach((path) => {
        const pathEl = path as SVGPathElement;
        const length = pathEl.getTotalLength();
        gsap.set(pathEl, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation — slide up
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.6,
            ease: 'power4.inOut',
            delay: 0.2,
            onComplete: () => {
              setComplete(true);
              if (onComplete) onComplete();
            },
          });
        },
      });

      // Draw SVG strokes
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power2.inOut',
      }, 0);

      // Fade in tagline
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        0.6
      );

      // Fill in the strokes with cream after drawing
      tl.to(paths, {
        fill: 'var(--color-cream)',
        fillOpacity: 1,
        duration: 0.4,
        ease: 'power2.in',
      }, 1.0);
    });

    return () => ctx.revert();
  }, [onComplete, shouldSkip]);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-[var(--color-bg)] flex flex-col items-center justify-center"
      aria-label="Loading WA Perfumes"
      role="progressbar"
    >
      {/* SVG "WA" Monogram — Stroke-draw animation */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 80"
        className="w-56 md:w-80 h-auto mb-8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* "W" letterform — elegant serif strokes */}
        <path
          className="wa-stroke-path"
          d="M 10 15 L 30 65 L 50 30 L 70 65 L 90 15"
          stroke="var(--color-cream)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          fillOpacity="0"
        />
        {/* Top serifs on W */}
        <path
          className="wa-stroke-path"
          d="M 5 15 L 15 15 M 85 15 L 95 15"
          stroke="var(--color-cream)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        
        {/* "A" letterform — classic serif A */}
        <path
          className="wa-stroke-path"
          d="M 110 65 L 140 15 L 170 65"
          stroke="var(--color-cream)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          fillOpacity="0"
        />
        {/* A crossbar */}
        <path
          className="wa-stroke-path"
          d="M 120 45 L 160 45"
          stroke="var(--color-cream)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Bottom serifs on A */}
        <path
          className="wa-stroke-path"
          d="M 105 65 L 115 65 M 165 65 L 175 65"
          stroke="var(--color-cream)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Decorative dot between W and A */}
        <circle
          className="wa-stroke-path"
          cx="100"
          cy="65"
          r="1.5"
          stroke="var(--color-cream)"
          strokeWidth="1"
          fill="none"
          fillOpacity="0"
        />
      </svg>

      {/* Tagline — fades in after stroke draw */}
      <p
        ref={taglineRef}
        className="text-[0.55rem] uppercase tracking-[0.5em] opacity-0"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        Leave Your Signature
      </p>
    </div>
  );
}
