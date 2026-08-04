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
      {/* Subtle rose-gold ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent-rose) 2%, transparent)' }} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Gold Divider */}
        <div className="divider-gold mb-16" />

        {/* Header */}
        <div className="mb-16 text-right">
          <p className="editorial-subtitle mb-4" style={{ color: 'var(--color-accent-rose)' }}>
            Collection Femme
          </p>
          <h2 className="heading-section text-[var(--color-text)]">W&A Femme</h2>
          <p className="body-large mt-4 max-w-xl ml-auto">
            Nine refined fragrances for the sophisticated woman. Lush florals, warm vanilla, and radiant musk.
          </p>
        </div>

        <OlfactoryPyramid top="Fleur d'Oranger, Pêche, Mandarine" heart="Rose de Mai, Jasmin, Tubéreuse" base="Vanille de Madagascar, Patchouli Blanc, Musc" />

        {/* Asymmetric Product Grid - opposite stagger from men */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
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
