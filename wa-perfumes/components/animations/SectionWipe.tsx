'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionWipe({ children, color, className = "" }: { children: React.ReactNode, color: string, className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // The wipe starts covering the element, then slides up revealing it
      gsap.fromTo(wipeRef.current,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.8,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      {/* Wipe overlay that will disappear */}
      <div 
        ref={wipeRef} 
        className="absolute inset-0 z-40 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      {children}
    </div>
  );
}
