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
    <div ref={containerRef} className="relative py-16 mb-8">
      {/* Background abstract smoke SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg viewBox="0 0 100 200" className="w-full h-full max-w-[200px]">
           <path className="pyramid-smoke opacity-30" d="M30,180 Q10,120 50,80 T70,20" fill="none" stroke="var(--color-accent)" strokeWidth="0.5" />
           <path className="pyramid-smoke opacity-30" d="M70,180 Q90,120 50,80 T30,20" fill="none" stroke="var(--color-accent)" strokeWidth="0.5" />
           <path className="pyramid-smoke opacity-30" d="M50,180 Q30,130 60,90 T40,20" fill="none" stroke="var(--color-accent)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* 3-Column Centered Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 max-w-4xl mx-auto text-center">
        {/* Top Notes */}
        <div ref={topRef} className="flex flex-col items-center gap-4 px-6 md:border-r md:border-[var(--color-border-subtle)]">
          <div className="w-8 h-8 rounded-full border border-[var(--color-accent)] flex items-center justify-center opacity-60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 18v4M16.24 16.24l2.83 2.83M18 12h4M16.24 7.76l2.83-2.83" /></svg>
          </div>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)]">Notes de T&ecirc;te</span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40" />
          <div className="pyramid-note-text font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-[var(--color-accent)] italic leading-relaxed">{top}</div>
        </div>

        {/* Heart Notes */}
        <div ref={heartRef} className="flex flex-col items-center gap-4 px-6 md:border-r md:border-[var(--color-border-subtle)]">
          <div className="w-8 h-8 rounded-full border border-[var(--color-text-muted)] flex items-center justify-center opacity-60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12 4 12 4S12.76 3 14.5 3C17.58 3 20 5.42 20 8.5C20 13.5 12 21 12 21Z" /></svg>
          </div>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)]">Notes de C&oelig;ur</span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-text-muted)] to-transparent opacity-40" />
          <div className="pyramid-note-text font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-[var(--color-text)] italic leading-relaxed">{heart}</div>
        </div>

        {/* Base Notes */}
        <div ref={baseRef} className="flex flex-col items-center gap-4 px-6">
          <div className="w-8 h-8 rounded-full border border-[var(--color-text-subtle)] flex items-center justify-center opacity-60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-subtle)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" /><path d="M12 14V22" /></svg>
          </div>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)]">Notes de Fond</span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-text-subtle)] to-transparent opacity-40" />
          <div className="pyramid-note-text font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-[var(--color-text-muted)] italic leading-relaxed">{base}</div>
        </div>
      </div>
    </div>
  );
}
