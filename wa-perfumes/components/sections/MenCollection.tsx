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
      {/* Gold Divider */}
      <div className="divider-gold mb-16" />

      {/* Header */}
      <div className="mb-16">
        <p className="editorial-subtitle mb-4">Collection Homme</p>
        <h2 className="heading-section text-[var(--color-text)]">W&A Homme</h2>
        <p className="body-large mt-4 max-w-xl">
          Thirteen powerful fragrances crafted for the modern gentleman. Bold, deep, unforgettable.
        </p>
      </div>

      <OlfactoryPyramid top="Bergamote, Poivre Noir, Cardamome" heart="Bois d'Agar, Vétiver, Cèdre" base="Ambre, Musc Cuiré, Fève Tonka" />

      {/* Asymmetric Product Grid */}
      <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {MEN_PRODUCTS.map((product: any, index: number) => (
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
