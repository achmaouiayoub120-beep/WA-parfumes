'use client';

import { useEffect, useRef } from 'react';
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
  const worldRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      worldRefs.current.forEach((world, i) => {
        if (!world) return;

        const content = world.querySelector('.world-content');
        const image = world.querySelector('.world-image');
        const notes = world.querySelectorAll('.world-note');

        // Fade in content
        gsap.fromTo(
          content,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: world,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.8,
            },
          }
        );

        // Parallax image
        gsap.fromTo(
          image,
          { scale: 1.1, opacity: 0.3 },
          {
            scale: 1,
            opacity: 0.5,
            scrollTrigger: {
              trigger: world,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );

        // Stagger notes
        gsap.fromTo(
          notes,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: world,
              start: 'top 50%',
              once: true,
            },
          }
        );

        // Fade out when scrolling past
        if (i < WORLDS.length - 1) {
          gsap.to(content, {
            opacity: 0,
            y: -40,
            scrollTrigger: {
              trigger: world,
              start: 'bottom 60%',
              end: 'bottom 20%',
              scrub: 0.8,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Section Header */}
      <div className="py-20 px-6 text-center">
        <p className="editorial-subtitle mb-4">The Olfactory Journey</p>
        <h2 className="heading-section text-[var(--color-text)]">
          Three Worlds
        </h2>
        <div className="w-16 h-[1px] bg-[var(--color-gold)] mx-auto mt-8 opacity-40" />
      </div>

      {/* Worlds */}
      {WORLDS.map((world, i) => (
        <div
          key={world.num}
          ref={(el) => { worldRefs.current[i] = el; }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="world-image absolute inset-0 opacity-30">
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
          <div className="world-content relative z-10 text-center px-6 max-w-2xl mx-auto">
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
  );
}
