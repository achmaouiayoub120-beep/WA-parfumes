'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEN_PRODUCTS } from '@/data/products/men';
import ProductCard from '@/components/ui/ProductCard';
import OlfactoryPyramid from '@/components/ui/OlfactoryPyramid';

gsap.registerPlugin(ScrollTrigger);

export default function MenCollection() {
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
    <section ref={sectionRef} className="py-section px-gutter max-w-[1440px] mx-auto" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)', paddingLeft: 'var(--space-gutter)', paddingRight: 'var(--space-gutter)' }}>
      {/* Accent Divider */}
      <div className="divider-gold mb-16" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-20 animate-fade-up">
        {/* Symmetrical Subtitle */}
        <div className="flex items-center justify-center gap-4 mb-8 opacity-80">
          <div className="w-12 h-[1px] bg-[var(--color-silver)] opacity-50" />
          <p className="editorial-subtitle text-[var(--color-text-subtle)]">Collection Homme</p>
          <div className="w-12 h-[1px] bg-[var(--color-silver)] opacity-50" />
        </div>

        {/* Main Title */}
        <h2 className="heading-display text-[var(--color-text)] mb-8 text-5xl md:text-6xl lg:text-7xl">
          W&A <span className="italic text-[var(--color-text-muted)] font-light">Homme</span>
        </h2>

        {/* Text Container */}
        <div className="relative max-w-2xl mx-auto flex flex-col items-center">
          <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
          
          <p className="body-large text-[var(--color-text-muted)] leading-relaxed mb-10 pt-6">
            Thirteen powerful fragrances crafted for the modern gentleman. <strong className="text-[var(--color-text)] font-normal">Bold, deep, unforgettable.</strong>
          </p>
        </div>

        {/* Olfactory Notes */}
        <OlfactoryPyramid top="Bergamote, Poivre Noir, Cardamome" heart="Bois d'Agar, Vétiver, Cèdre" base="Ambre, Musc Cuiré, Fève Tonka" />
      </div>

      {/* Asymmetric Product Grid */}
      <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
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
