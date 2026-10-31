'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEN_PRODUCTS } from '@/data/products/men';
import ProductCard from '@/components/ui/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function MenCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll('.product-card-wrapper');
      
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const cardWidth = clientWidth * 0.78 + 16;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(index, MEN_PRODUCTS.length - 1));
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-[1440px] mx-auto overflow-hidden"
    >
      {/* Accent Divider */}
      <div className="divider-gold mb-12 md:mb-16" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16 animate-fade-up">
        {/* Symmetrical Subtitle */}
        <div className="flex items-center justify-center gap-4 mb-6 opacity-80">
          <div className="w-10 sm:w-12 h-[1px] bg-[var(--color-silver)] opacity-50" />
          <p className="editorial-subtitle text-[var(--color-text-subtle)]">Collection Homme</p>
          <div className="w-10 sm:w-12 h-[1px] bg-[var(--color-silver)] opacity-50" />
        </div>

        {/* Main Title */}
        <h2 className="heading-display text-[var(--color-text)] mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          W&A <span className="italic text-[var(--color-text-muted)] font-light">Homme</span>
        </h2>

        {/* Text Container */}
        <div className="relative max-w-2xl mx-auto flex flex-col items-center">
          <p className="body-large text-[var(--color-text-muted)] leading-relaxed text-center text-sm sm:text-base">
            Treize fragrances d&apos;exception façonnées pour l&apos;homme contemporain.{' '}
            <strong className="text-[var(--color-text)] font-medium">Audacieux, profond, inoubliable.</strong>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE: Horizontal Native Scroll-Snap Row (md:hidden)
          ═══════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        <div 
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-6 scrollbar-none"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {MEN_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="w-[78vw] max-w-[280px] shrink-0 snap-center"
              style={{ scrollSnapAlign: 'center' }}
            >
              <ProductCard product={{ ...product, collection: 'homme' as const }} />
            </div>
          ))}
        </div>

        {/* Mobile scroll position indicator & CTA */}
        <div className="flex flex-col items-center gap-4 mt-2">
          {/* Scroll progress dots */}
          <div className="flex items-center gap-1.5">
            {MEN_PRODUCTS.slice(0, 6).map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeSlide === i 
                    ? 'w-6 bg-[var(--color-silver)]' 
                    : 'w-1.5 bg-[var(--color-border)]'
                }`}
              />
            ))}
            {MEN_PRODUCTS.length > 6 && (
              <span className="text-[10px] text-[var(--color-text-subtle)] ml-1">
                +{MEN_PRODUCTS.length - 6}
              </span>
            )}
          </div>

          {/* View collection button */}
          <Link
            href="/#homme"
            className="text-xs uppercase tracking-[0.2em] py-3 px-6 rounded-full border border-[var(--color-border)] text-[var(--color-text)] font-medium active:scale-95 transition-transform"
          >
            Explorer les 13 créations Homme →
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP: Original Asymmetric Product Grid (hidden md:grid)
          ═══════════════════════════════════════════════════════ */}
      <div 
        ref={cardsRef} 
        className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {MEN_PRODUCTS.map((product, index: number) => (
          <div
            key={product.id}
            className={`product-card-wrapper ${
              index % 5 === 1 ? 'md:mt-12' : index % 5 === 3 ? 'md:mt-8' : ''
            }`}
          >
            <ProductCard product={{ ...product, collection: 'homme' as const }} />
          </div>
        ))}
      </div>
    </section>
  );
}
