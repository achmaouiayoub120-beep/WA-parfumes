'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entry animation
      const tl = gsap.timeline({ delay: 2.8 }); // After preloader

      tl.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 1.5, ease: 'power2.out' },
        0
      );

      tl.fromTo(
        imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power3.out' },
        0.2
      );

      // Split title into characters for staggered reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || '';
        titleRef.current.innerHTML = text
          .split('')
          .map((char) =>
            char === ' '
              ? ' '
              : `<span class="inline-block opacity-0 translate-y-[60px]">${char}</span>`
          )
          .join('');

        const chars = titleRef.current.querySelectorAll('span');
        tl.to(
          chars,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.out',
          },
          0.8
        );
      }

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        1.4
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        1.8
      );

      // Check reduced motion
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      // Calibrate parallax for small screens (prevent floating issues on <900px height)
      const isSmallScreen = window.innerHeight < 900;
      const bgY = isSmallScreen ? 10 : 20;
      const smokeY = isSmallScreen ? 5 : 10;
      const titleY = isSmallScreen ? -15 : -30;

      // Parallax on scroll
      gsap.to(imageRef.current, {
        yPercent: bgY,
        scale: 1.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(smokeRef.current, {
        yPercent: smokeY,
        opacity: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(titleRef.current, {
        yPercent: titleY,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      });

      gsap.to(subtitleRef.current, {
        yPercent: titleY / 2,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with Parallax */}
      <div ref={imageRef} className="absolute inset-0 opacity-0">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="WA Perfumes luxury fragrance"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={85}
        />
      </div>

      {/* Smoke Layer with Parallax */}
      <div ref={smokeRef} className="absolute inset-0 opacity-0 mix-blend-screen pointer-events-none">
        <Image
          src="/images/hero/hero-smoke.png"
          alt="Smoke effect"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={70}
        />
        {/* Dark overlay for text readability, moved above smoke so text is clear */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-bg) 70%, transparent), color-mix(in srgb, var(--color-bg) 40%, transparent), var(--color-bg))' }} />
      </div>

      {/* Initial black overlay for reveal */}
      <div ref={overlayRef} className="absolute inset-0 bg-[var(--color-bg)] z-10" />

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <p className="editorial-subtitle mb-8 opacity-0" ref={subtitleRef}>
          Parfums de Luxe Ultra-Premium
        </p>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="heading-display text-[var(--color-text)] mb-8"
        >
          Leave Your Signature
        </h1>

        {/* CTA */}
        <div ref={ctaRef} className="opacity-0">
          <MagneticButton
            className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border rounded-none text-[0.7rem] uppercase tracking-[0.3em] text-[var(--color-gold)] hover:bg-[var(--color-border)] transition-colors duration-500"
            style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 30%, transparent)' }}
          >
            Explorer les Collections
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)]">
          Défiler
        </span>
        <div className="w-[1px] h-8 relative overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--color-gold) 20%, transparent)' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-gold)] animate-[slideDown_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
