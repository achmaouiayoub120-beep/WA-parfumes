'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORLDS = [
  {
    num: '01',
    name: 'Oud Forest',
    description: 'A journey through ancient woods where smoke curls between dark trees and gold dust settles like whispered secrets.',
    notes: ['Oud', 'Cedarwood', 'Smoke'],
    image: '/images/hero/hero-bg.jpg',
    gradient: 'linear-gradient(to bottom, #1a1412, var(--color-bg), #0d0b09)',
  },
  {
    num: '02',
    name: 'Amber Desert',
    description: 'Warm sands stretch endlessly under a golden sun, carrying the rich sweetness of amber and sun-baked spice.',
    notes: ['Amber', 'Saffron', 'Vanilla'],
    image: '/images/gallery/gallery-01.jpg',
    gradient: 'linear-gradient(to bottom, #2a1a08, var(--color-bg), #1a1408)',
  },
  {
    num: '03',
    name: 'Vanilla Clouds',
    description: 'Floating through cream-soft atmospheres where light filters golden through layers of sweetness and warmth.',
    notes: ['Vanilla', 'Tonka Bean', 'Musk'],
    image: '/images/gallery/gallery-02.jpg',
    gradient: 'linear-gradient(to bottom, #1a1816, var(--color-bg), #141210)',
  },
];

export default function ScrollStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const worldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // For reduced motion: simple fade-in without pinning
        worldRefs.current.forEach((world) => {
          if (!world) return;
          gsap.set(world, { opacity: 1 });
        });
        return;
      }

      // Pin the container while we scroll through all worlds
      const totalWorlds = WORLDS.length;
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalWorlds * 100}vh`,
        pin: pinnedRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(Math.floor(progress * totalWorlds), totalWorlds - 1);
          setActiveIndex(index);

          // Update progress bar
          if (progressRef.current) {
            progressRef.current.style.height = `${progress * 100}%`;
          }
        },
      });

      // Animate each world based on scroll progress
      worldRefs.current.forEach((world, i) => {
        if (!world) return;
        const content = world.querySelector('.world-content');
        const image = world.querySelector('.world-image');

        if (!content || !image) return;

        const startProgress = i / totalWorlds;
        const endProgress = (i + 1) / totalWorlds;
        const midProgress = startProgress + (endProgress - startProgress) * 0.5;

        // Image cross-fade
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalWorlds * 100}vh`,
          onUpdate: (self) => {
            const p = self.progress;
            if (p >= startProgress && p < endProgress) {
              // Fade in during first half, stay during second half
              const localProgress = (p - startProgress) / (endProgress - startProgress);
              const fadeIn = Math.min(localProgress * 3, 1); // Quick fade in
              const fadeOut = localProgress > 0.8 && i < totalWorlds - 1 ? (localProgress - 0.8) * 5 : 0;
              
              gsap.set(image, { opacity: 0.5 * (fadeIn - fadeOut) });
              gsap.set(content, { 
                opacity: fadeIn - fadeOut,
                y: (1 - fadeIn) * 40 + fadeOut * -30,
              });
            } else {
              gsap.set(image, { opacity: 0 });
              gsap.set(content, { opacity: 0 });
            }
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Section Header — outside pinned area */}
      <div className="py-20 px-6 text-center">
        <p className="editorial-subtitle mb-4">The Olfactory Journey</p>
        <h2 className="heading-section text-[var(--color-text)]">
          Three Worlds
        </h2>
        <div className="w-16 h-[1px] bg-[var(--color-gold)] mx-auto mt-8 opacity-40" />
      </div>

      {/* Pinned viewport — stays fixed while worlds cycle */}
      <div ref={pinnedRef} className="relative h-screen w-full overflow-hidden">
        {/* Progress Indicator — left side */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
          {/* Progress bar track */}
          <div className="relative w-[2px] h-32 bg-[color-mix(in_srgb,var(--color-gold)_15%,transparent)] rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full bg-[var(--color-gold)] rounded-full transition-none"
              style={{ height: '0%' }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex flex-col gap-3">
            {WORLDS.map((world, i) => (
              <span
                key={world.num}
                className="font-[family-name:var(--font-cormorant)] text-sm transition-all duration-500"
                style={{
                  color: i === activeIndex ? 'var(--color-gold)' : 'var(--color-text-subtle)',
                  opacity: i === activeIndex ? 1 : 0.4,
                  transform: i === activeIndex ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {world.num}
              </span>
            ))}
          </div>
        </div>

        {/* Worlds — stacked absolutely, opacity-controlled */}
        {WORLDS.map((world, i) => (
          <div
            key={world.num}
            ref={(el) => { worldRefs.current[i] = el; }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background Image */}
            <div className="world-image absolute inset-0 opacity-0">
              <Image
                src={world.image}
                alt={world.name}
                fill
                className="object-cover"
                sizes="100vw"
                quality={75}
              />
              <div className="absolute inset-0" style={{ background: world.gradient }} />
            </div>

            {/* Content */}
            <div className="world-content relative z-10 text-center px-6 max-w-2xl mx-auto opacity-0">
              <span className="editorial-subtitle mb-4 block">
                World {world.num}
              </span>

              <h3 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.06em] text-[var(--color-text)] mb-6">
                {world.name}
              </h3>

              <p className="body-large mb-10 max-w-lg mx-auto">
                {world.description}
              </p>

              {/* Notes Badges */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {world.notes.map((note) => (
                  <span
                    key={note}
                    className="world-note px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] border text-[var(--color-gold)] rounded-full"
                    style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 20%, transparent)' }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
