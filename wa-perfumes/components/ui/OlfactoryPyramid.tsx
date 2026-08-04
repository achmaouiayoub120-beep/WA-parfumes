'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default function OlfactoryPyramid({ top, heart, base }: { top: string, heart: string, base: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const smoke = gsap.utils.toArray('.pyramid-smoke');

      // Smoke continuous ambient animation
      if (!reducedMotion) {
        gsap.to(smoke, {
          y: -20,
          opacity: 0.6,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 1
        });
      }

      const elements = [topRef.current, heartRef.current, baseRef.current];
      
      elements.forEach((el, index) => {
        if (!el) return;
        const textToSplit = el.querySelector('.pyramid-note-text');
        
        if (textToSplit && !reducedMotion) {
          const split = new SplitType(textToSplit as HTMLElement, { types: 'lines' });
          
          gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              delay: index * 0.2, 
              ease: 'power3.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                once: true
              }
            }
          );

          if (split.lines) {
            gsap.fromTo(split.lines,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                delay: index * 0.2 + 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: 'top 80%',
                  once: true
                }
              }
            );
          }
        }
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative max-w-sm mx-auto py-12 flex flex-col items-center gap-8 mb-8">
      {/* Background abstract smoke SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg viewBox="0 0 100 200" className="w-full h-full max-w-[200px]">
           <path className="pyramid-smoke opacity-30" d="M30,180 Q10,120 50,80 T70,20" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" />
           <path className="pyramid-smoke opacity-30" d="M70,180 Q90,120 50,80 T30,20" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" />
           <path className="pyramid-smoke opacity-30" d="M50,180 Q30,130 60,90 T40,20" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" />
        </svg>
      </div>

      <div ref={topRef} className="text-center z-10 w-full">
        <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[var(--color-text-subtle)] block mb-2">Notes de Tête</span>
        <div className="pyramid-note-text font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-gold)]">{top}</div>
      </div>
      
      <div ref={heartRef} className="text-center z-10 w-full">
        <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[var(--color-text-subtle)] block mb-2">Notes de Cœur</span>
        <div className="pyramid-note-text font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">{heart}</div>
      </div>
      
      <div ref={baseRef} className="text-center z-10 w-full">
        <span className="text-[0.55rem] uppercase tracking-[0.25em] text-[var(--color-text-subtle)] block mb-2">Notes de Fond</span>
        <div className="pyramid-note-text font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text-muted)]">{base}</div>
      </div>
    </div>
  );
}
