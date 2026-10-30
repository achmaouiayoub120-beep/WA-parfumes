'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORLDS = [
  {
    num: '01',
    name: "Forêt d'Oud",
    description: "Un voyage au cœur de bois millénaires où les volutes d'encens s'élèvent entre les troncs sombres et les résines précieuses.",
    notes: ['Oud Rare', 'Bois de Cèdre', 'Encens'],
    image: '/images/worlds/oud-forest.jpg',
    gradient: 'linear-gradient(to bottom, rgba(14, 10, 16, 0.7) 0%, rgba(14, 10, 16, 0.4) 50%, rgba(14, 10, 16, 0.9) 100%)',
  },
  {
    num: '02',
    name: "Désert d'Ambre",
    description: "Des étendues de sables dorés sous un soleil crépusculaire, révélant la chaleur sensuelle de l'ambre et des épices chaudes.",
    notes: ['Ambre Chaud', 'Safran Noble', 'Vanille'],
    image: '/images/worlds/amber-desert.jpg',
    gradient: 'linear-gradient(to bottom, rgba(28, 14, 10, 0.7) 0%, rgba(28, 14, 10, 0.4) 50%, rgba(14, 10, 16, 0.9) 100%)',
  },
  {
    num: '03',
    name: 'Nuages de Vanille',
    description: "Une atmosphère douce comme une caresse, où la lumière filtre dorée à travers des volutes soyeuses de crème et de tonka.",
    notes: ['Vanille Précieuse', 'Fève Tonka', 'Musc Blanc'],
    image: '/images/worlds/vanilla-clouds.jpg',
    gradient: 'linear-gradient(to bottom, rgba(20, 14, 22, 0.7) 0%, rgba(20, 14, 22, 0.4) 50%, rgba(14, 10, 16, 0.9) 100%)',
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
        worldRefs.current.forEach((world) => {
          if (!world) return;
          gsap.set(world, { opacity: 1 });
        });
        return;
      }

      const totalWorlds = WORLDS.length;
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalWorlds * 100}%`,
        pin: pinnedRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(Math.floor(progress * totalWorlds), totalWorlds - 1);
          setActiveIndex(index);

          if (progressRef.current) {
            progressRef.current.style.height = `${progress * 100}%`;
          }
        },
      });

      worldRefs.current.forEach((world, i) => {
        if (!world) return;
        const content = world.querySelector('.world-content');
        const image = world.querySelector('.world-image');

        if (!content || !image) return;

        const startProgress = i / totalWorlds;
        const endProgress = (i + 1) / totalWorlds;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalWorlds * 100}%`,
          onUpdate: (self) => {
            const p = self.progress;
            if (p >= startProgress && p < endProgress) {
              const localProgress = (p - startProgress) / (endProgress - startProgress);
              const fadeIn = Math.min(localProgress * 3, 1);
              const fadeOut = localProgress > 0.8 && i < totalWorlds - 1 ? (localProgress - 0.8) * 5 : 0;
              
              gsap.set(image, { opacity: 0.85 * (fadeIn - fadeOut) });
              gsap.set(content, { 
                opacity: fadeIn - fadeOut,
                y: (1 - fadeIn) * 30 + fadeOut * -20,
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
    <div ref={containerRef} className="relative bg-[var(--color-bg)]">
      {/* Section Header */}
      <div className="py-16 md:py-20 px-6 text-center">
        <p className="editorial-subtitle mb-4">Le Voyage Olfactif</p>
        <h2 className="heading-section text-[var(--color-text)]">
          Trois Mondes
        </h2>
        <div className="w-16 h-[1px] bg-[var(--color-accent)] mx-auto mt-8 opacity-40" />
      </div>

      {/* Pinned viewport */}
      <div ref={pinnedRef} className="relative h-[100dvh] w-full overflow-hidden">
        {/* Progress Indicator */}
        <div className="absolute left-4 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
          <div className="relative w-[2px] h-28 md:h-32 bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full bg-[var(--color-silver)] rounded-full transition-none"
              style={{ height: '0%' }}
            />
          </div>
          
          <div className="flex flex-col gap-3">
            {WORLDS.map((world, i) => (
              <span
                key={world.num}
                className="font-[family-name:var(--font-cormorant)] text-xs sm:text-sm transition-all duration-300"
                style={{
                  color: i === activeIndex ? 'var(--color-silver)' : 'var(--color-text-subtle)',
                  opacity: i === activeIndex ? 1 : 0.4,
                  transform: i === activeIndex ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {world.num}
              </span>
            ))}
          </div>
        </div>

        {/* Worlds */}
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
                quality={80}
              />
              <div className="absolute inset-0" style={{ background: world.gradient }} />
            </div>

            {/* Content */}
            <div className="world-content relative z-10 text-center px-6 max-w-2xl mx-auto opacity-0">
              <span className="editorial-subtitle mb-3 block text-xs">
                Monde {world.num}
              </span>

              <h3 className="font-[family-name:var(--font-cormorant)] text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.05em] text-[var(--color-text)] mb-4 md:mb-6">
                {world.name}
              </h3>

              <p className="body-large mb-8 md:mb-10 max-w-lg mx-auto text-sm sm:text-base leading-relaxed text-[var(--color-text-muted)]">
                {world.description}
              </p>

              {/* Notes Badges */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
                {world.notes.map((note) => (
                  <span
                    key={note}
                    className="world-note px-3.5 py-1 text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.2em] border text-[var(--color-silver)] rounded-full backdrop-blur-sm"
                    style={{ borderColor: 'color-mix(in srgb, var(--color-silver) 30%, transparent)' }}
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
