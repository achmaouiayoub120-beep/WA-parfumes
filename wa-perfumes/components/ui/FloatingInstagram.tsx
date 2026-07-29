'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function FloatingInstagram() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Add a gentle floating animation
    const ctx = gsap.context(() => {
      gsap.to(buttonRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }, buttonRef);

    return () => ctx.revert();
  }, []);

  return (
    <a
      ref={buttonRef}
      href="https://www.instagram.com/w_a_perfume/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-10 z-[90] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--color-float-bg)] backdrop-blur-md border border-[var(--color-float-border)] shadow-[var(--color-float-shadow)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] hover:scale-110 hover:shadow-[var(--color-float-shadow)] transition-all duration-500 overflow-hidden group"
      aria-label="Follow us on Instagram"
    >
      {/* Background glow sweep effect on hover */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      
      {/* Instagram Icon */}
      <svg className="relative z-10 w-6 h-6 md:w-7 md:h-7 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </a>
  );
}
