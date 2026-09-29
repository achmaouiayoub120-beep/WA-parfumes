'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import ProductCard from '@/components/ui/ProductCard';
import OlfactoryPyramid from '@/components/ui/OlfactoryPyramid';

gsap.registerPlugin(ScrollTrigger);

export default function WomenCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardsRef.current) return;

      const cards = cardsRef.current.querySelectorAll('.product-card-wrapper');

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
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

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        paddingTop: 'var(--space-section)',
        paddingBottom: 'var(--space-section)',
        paddingLeft: 'var(--space-gutter)',
        paddingRight: 'var(--space-gutter)',
      }}
    >
      {/* Subtle rose ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent-rose) 2%, transparent)' }} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Accent Divider */}
        <div className="divider-gold mb-16" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20 animate-fade-up">
          {/* Symmetrical Subtitle */}
          <div className="flex items-center justify-center gap-4 mb-8 opacity-80">
            <div className="w-12 h-[1px] bg-[var(--color-accent-rose)] opacity-50" />
            <p className="editorial-subtitle text-[var(--color-accent-rose)]">Collection Femme</p>
            <div className="w-12 h-[1px] bg-[var(--color-accent-rose)] opacity-50" />
          </div>

          {/* Main Title */}
          <h2 className="heading-display text-[var(--color-text)] mb-8 text-5xl md:text-6xl lg:text-7xl">
            W&A <span className="italic text-[var(--color-text-muted)] font-light">Femme</span>
          </h2>

          {/* Text Container */}
          <div className="relative max-w-2xl mx-auto flex flex-col items-center">
            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
            
            <p className="body-large text-[var(--color-text-muted)] leading-relaxed mb-10 pt-6">
              Nine refined fragrances for the sophisticated woman. <strong className="text-[var(--color-text)] font-normal">Lush florals, warm vanilla, and radiant musk.</strong>
            </p>
          </div>

          {/* Olfactory Notes */}
          <OlfactoryPyramid top="Fleur d'Oranger, Pêche, Mandarine" heart="Rose de Mai, Jasmin, Tubéreuse" base="Vanille de Madagascar, Patchouli Blanc, Musc" />
        </div>



        {/* Asymmetric Product Grid - opposite stagger from men */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8"
        >
          {WOMEN_PRODUCTS.map((product: any, index: number) => (
            <div
              key={product.id}
              className={`product-card-wrapper ${
                index % 5 === 0 ? 'md:mt-12' : index % 5 === 2 ? 'md:mt-8' : ''
              }`}
            >
              <ProductCard product={{ ...product, collection: 'femme' as const }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
