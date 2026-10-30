'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';
import { motion } from 'framer-motion';

const COLLECTIONS = [
  {
    name: 'WA Signature',
    tagline: 'Sombre & Audacieux',
    description: 'Treize parfums puissants pour le gentleman moderne. Bois profonds, oud riche et épices magnétiques.',
    image: '/images/collections/homme-banner.jpg',
    href: '/#homme',
    accent: 'var(--color-silver)',
  },
  {
    name: 'WA Elegance',
    tagline: 'Doux & Éléguant',
    description: 'Neuf parfums raffinés pour la femme sophistiquée. Fleurs luxuriantes, vanille chaude et musc éclatant.',
    image: '/images/collections/femme-banner.jpg',
    href: '/#femme',
    accent: 'var(--color-accent-rose)',
  },
  {
    name: 'WA Unisexe',
    tagline: "L'Essence Universelle",
    description: "Une collection conçue pour être partagée. Des accords raffinés qui s'adaptent à votre peau pour créer une signature olfactive unique, au-delà des genres.",
    image: '/images/collections/unisexe-banner.png',
    href: '/#unisexe',
    accent: 'var(--color-violet)',
  },
];

export default function CollectionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: width * index,
      behavior: 'smooth',
    });
  };

  return (
    <div className="py-16 md:py-24 bg-[var(--color-bg)]">
      {/* Section Header */}
      <div className="text-center px-6 mb-12 md:mb-16">
        <p className="editorial-subtitle mb-4">Nos Collections</p>
        <h2 className="heading-section text-[var(--color-text)]">Trois Mondes</h2>
        <div className="w-16 h-[1px] bg-[var(--color-accent)] mx-auto mt-8 opacity-40" />
      </div>

      {/* Slider Wrapper */}
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Scroll Container */}
        <div 
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-8"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {COLLECTIONS.map((col, idx) => (
            <div
              key={col.name}
              className="w-full shrink-0 snap-center relative flex flex-col md:flex-row items-center bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-[45vh] md:h-[65vh] relative overflow-hidden group">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col justify-center relative">
                {/* Decorative background number */}
                <span className="absolute top-6 right-6 md:top-8 md:right-8 text-6xl md:text-8xl font-[family-name:var(--font-cormorant)] text-[var(--color-text)] opacity-[0.03] select-none pointer-events-none">
                  0{idx + 1}
                </span>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-[0.65rem] uppercase tracking-[0.35em] mb-3 md:mb-4 font-medium" 
                  style={{ color: col.accent }}
                >
                  {col.tagline}
                </motion.p>

                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-[family-name:var(--font-cormorant)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.06em] text-[var(--color-text)] mb-4 md:mb-6"
                >
                  {col.name}
                </motion.h3>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="body-large mb-8 md:mb-10 text-[var(--color-text-muted)] leading-relaxed max-w-md text-sm sm:text-base"
                >
                  {col.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Link href={col.href}>
                    <MagneticButton 
                      className="px-6 sm:px-8 py-3 border text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-text)] hover:text-[var(--color-bg)] hover:bg-[var(--color-text)] transition-all duration-500 rounded-full min-h-[44px] flex items-center justify-center"
                      style={{ borderColor: 'color-mix(in srgb, var(--color-border) 40%, transparent)' }}
                    >
                      Découvrir la collection
                    </MagneticButton>
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls — Touch targets ≥ 44px */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-4">
          <button 
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            className="w-11 h-11 rounded-full flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-muted)]"
            disabled={activeIndex === 0}
            aria-label="Diapositive précédente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          {/* Pagination Dots — 44px touch targets */}
          <div className="flex gap-1">
            {COLLECTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className="w-11 h-11 flex items-center justify-center group"
                aria-label={`Aller à la diapositive ${idx + 1}`}
              >
                <div 
                  className={`h-[2px] transition-all duration-500 ${
                    activeIndex === idx 
                      ? 'w-8 bg-[var(--color-accent)]' 
                      : 'w-4 bg-[var(--color-border)] group-hover:bg-[var(--color-text-muted)]'
                  }`}
                />
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollTo(Math.min(COLLECTIONS.length - 1, activeIndex + 1))}
            className="w-11 h-11 rounded-full flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-muted)]"
            disabled={activeIndex === COLLECTIONS.length - 1}
            aria-label="Diapositive suivante"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
