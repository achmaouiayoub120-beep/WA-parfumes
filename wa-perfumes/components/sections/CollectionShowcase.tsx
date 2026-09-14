'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS = [
  {
    name: 'WA Signature',
    tagline: 'Dark & Bold',
    description: 'Thirteen powerful fragrances for the modern gentleman. Deep woods, rich oud, and magnetic spice.',
    image: '/images/collections/homme-banner.jpg',
    href: '/#signature',
    accent: 'var(--color-gold)',
  },
  {
    name: 'WA Elegance',
    tagline: 'Soft & Elegant',
    description: 'Nine refined fragrances for the sophisticated woman. Lush florals, warm vanilla, and radiant musk.',
    image: '/images/collections/femme-banner.jpg',
    href: '/#elegance',
    accent: 'var(--color-accent-rose)',
  },
];

export default function CollectionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!scrollRef.current || !containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.collection-panel');
        
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${containerRef.current!.offsetWidth}`,
            anticipatePin: 1,
          },
        });

        // Animate content within each panel
        panels.forEach((panel) => {
          const content = panel.querySelector('.panel-content');
          gsap.fromTo(
            content,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 30%',
                scrub: 0.8,
              },
            }
          );
        });
      });

      // Mobile fade-in animation
      mm.add("(max-width: 1023px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>('.collection-panel');
        panels.forEach((panel) => {
          const content = panel.querySelector('.panel-content');
          gsap.fromTo(
            content,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 70%',
                once: true,
              },
            }
          );
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="py-20">
      {/* Section Header */}
      <div className="text-center px-6 mb-16">
        <p className="editorial-subtitle mb-4">Our Collections</p>
        <h2 className="heading-section text-[var(--color-text)]">Two Worlds</h2>
        <div className="w-16 h-[1px] bg-[var(--color-gold)] mx-auto mt-8 opacity-40" />
      </div>

      {/* Container */}
      <div ref={containerRef} className="overflow-hidden">
        <div ref={scrollRef} className="flex flex-col lg:flex-row lg:w-[200vw]">
          {COLLECTIONS.map((col) => (
            <div
              key={col.name}
              className="collection-panel w-full lg:w-screen h-[70vh] lg:h-[80vh] relative flex items-center shrink-0"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={80}
                />
                <div 
                  className="absolute inset-0" 
                  style={{ background: 'linear-gradient(to right, var(--color-bg), color-mix(in srgb, var(--color-bg) 80%, transparent), transparent)' }}
                />
              </div>

              {/* Content */}
              <div className="panel-content relative z-10 px-10 md:px-20 max-w-xl">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] mb-4" style={{ color: col.accent }}>
                  {col.tagline}
                </p>

                <h3 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl font-light tracking-[0.06em] text-[var(--color-text)] mb-6">
                  {col.name}
                </h3>

                <p className="body-large mb-10">
                  {col.description}
                </p>

                <Link href={col.href}>
                  <MagneticButton 
                    className="px-8 py-3 border text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-gold)] transition-colors duration-500"
                    style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 25%, transparent)' }}
                  >
                    Explore
                  </MagneticButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
