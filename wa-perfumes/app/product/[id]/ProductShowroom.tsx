'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import MagneticButton from '@/components/ui/MagneticButton';
import type { Product } from '@/data/products/men';

export default function ProductShowroom({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const isSignature = product.collection === 'signature';
  const accent = isSignature ? 'var(--color-gold)' : 'var(--color-accent-rose)';
  const accentMuted = isSignature ? 'var(--color-gold-bg-hover)' : 'var(--color-accent-rose-muted)';
  const accentBorder = isSignature ? 'var(--color-gold-border)' : 'var(--color-accent-rose-border)';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );

      if (infoRef.current) {
        const els = infoRef.current.querySelectorAll('.reveal-item');
        gsap.fromTo(
          els,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.5 }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <section ref={sectionRef} className="min-h-screen pt-24 pb-16">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 30% 50%, ${accentMuted}, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Breadcrumb */}
        <nav className="reveal-item mb-10 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em]">
          <Link href="/" className="text-[var(--color-text-subtle)] hover:text-[var(--color-gold)] transition-colors">
            Home
          </Link>
          <span className="text-[var(--color-text-subtle)]">/</span>
          <Link href={`/#${isSignature ? 'signature' : 'elegance'}`} className="text-[var(--color-text-subtle)] hover:text-[var(--color-gold)] transition-colors">
            {isSignature ? 'WA Signature' : 'WA Elegance'}
          </Link>
          <span className="text-[var(--color-text-subtle)]">/</span>
          <span className="text-[var(--color-text-muted)]">{product.name}</span>
        </nav>

        {/* Main Layout — Image + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Product Image */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="relative aspect-[3/4] bg-[var(--color-bg-elevated)] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                quality={90}
              />
              {/* Subtle bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[var(--color-bg)]/40 to-transparent" />
            </div>

            {/* Collection badge */}
            <div className="absolute top-6 left-6">
              <span
                className="text-[0.55rem] uppercase tracking-[0.25em] px-3 py-1.5 backdrop-blur-sm"
                style={{
                  color: accent,
                  background: accentMuted,
                  border: `1px solid ${accentBorder}`,
                }}
              >
                {isSignature ? 'WA Signature' : 'WA Elegance'}
              </span>
            </div>
          </div>

          {/* Right — Product Info */}
          <div ref={infoRef} className="flex flex-col justify-center py-4">
            {/* Number */}
            <p className="reveal-item editorial-subtitle mb-4" style={{ color: accent }}>
              N°{product.number}
            </p>

            {/* Name */}
            <h1 className="reveal-item font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.04em] text-[var(--color-text)] mb-3">
              {product.name}
            </h1>

            {/* Inspiration */}
            <p className="reveal-item text-sm text-[var(--color-text-subtle)] italic mb-8">
              Olfactory profile inspired by {product.inspiredBy}
            </p>

            {/* Price & Volume */}
            <div className="reveal-item flex items-baseline gap-4 mb-10">
              <span className="font-[family-name:var(--font-cormorant)] text-3xl" style={{ color: accent }}>
                {product.price} DH
              </span>
              <span className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider">
                {product.volume}
              </span>
            </div>

            {/* Description */}
            <p className="reveal-item body-large mb-10 max-w-lg">
              {product.description}
            </p>

            {/* Visual Olfactory Notes Pyramid */}
            <div className="reveal-item mb-12 flex flex-col items-center border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 relative overflow-hidden rounded-sm">
              {/* Top ambient glow for pyramid */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[40px] rounded-full opacity-20 pointer-events-none"
                style={{ backgroundColor: accent }}
              />
              
              <h3 className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-8 relative z-10">
                Pyramide Olfactive
              </h3>

              <div className="flex flex-col items-center w-full gap-5 relative z-10">
                {/* Top Notes */}
                <div className="flex flex-col items-center w-[70%] pb-4 border-b border-[var(--color-border-faint)]">
                  <span className="text-[0.5rem] uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-2">Notes de Tête</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.topNotes?.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] bg-[var(--color-bg-card)] border rounded-full text-center shadow-sm"
                        style={{ color: accent, borderColor: accentBorder }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="flex flex-col items-center w-[85%] pb-4 border-b border-[var(--color-border-faint)]">
                  <span className="text-[0.5rem] uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-2">Notes de Cœur</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.heartNotes?.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] bg-[var(--color-bg-card)] border rounded-full text-center shadow-sm"
                        style={{ color: accent, borderColor: accentBorder }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div className="flex flex-col items-center w-full">
                  <span className="text-[0.5rem] uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-2">Notes de Fond</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.baseNotes?.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] bg-[var(--color-bg-card)] border rounded-full text-center shadow-sm"
                        style={{ color: accent, borderColor: accentBorder }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="reveal-item grid grid-cols-2 gap-4 mb-10 text-xs">
              <div>
                <span className="text-[var(--color-text-subtle)] uppercase tracking-wider block mb-1">Family</span>
                <span className="text-[var(--color-text)]">{product.fragranceFamily}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-subtle)] uppercase tracking-wider block mb-1">Longevity</span>
                <span className="text-[var(--color-text)] capitalize">{product.longevity}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-subtle)] uppercase tracking-wider block mb-1">Projection</span>
                <span className="text-[var(--color-text)] capitalize">{product.projection}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-subtle)] uppercase tracking-wider block mb-1">Mood</span>
                <span className="text-[var(--color-text)]">{product.mood}</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="reveal-item">
              <MagneticButton
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-12 py-4 text-[0.7rem] uppercase tracking-[0.3em] font-medium transition-colors duration-500"
                strength={0.2}
              >
                <span
                  className="relative z-10 block w-full sm:w-auto text-center"
                  style={{
                    color: 'var(--color-bg)',
                    backgroundColor: accent,
                    padding: '1rem 3rem',
                    marginTop: '-1rem',
                    marginBottom: '-1rem',
                    marginLeft: '-3rem',
                    marginRight: '-3rem',
                  }}
                >
                  Add to Collection
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
