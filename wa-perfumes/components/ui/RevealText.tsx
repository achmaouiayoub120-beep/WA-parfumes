'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  stagger?: number;
  scrub?: boolean;
}

export default function RevealText({
  children,
  className = '',
  as: Component = 'p',
  delay = 0,
  stagger = 0.03,
  scrub = false,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Split text into words and wrap each in a span
    const text = container.textContent || '';
    const words = text.split(' ');
    container.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden"><span class="reveal-word inline-block" style="transform: translateY(100%); opacity: 0;">${word}</span></span>`
      )
      .join(' ');

    const wordEls = container.querySelectorAll('.reveal-word');

    const ctx = gsap.context(() => {
      if (scrub) {
        gsap.to(wordEls, {
          y: 0,
          opacity: 1,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.8,
          },
        });
      } else {
        gsap.to(wordEls, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [children, delay, stagger, scrub]);

  return (
    <Component ref={containerRef as unknown as React.Ref<never>} className={className}>
      {children}
    </Component>
  );
}
