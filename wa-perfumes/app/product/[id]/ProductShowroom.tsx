'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import OlfactoryTimeline from '@/components/ui/OlfactoryTimeline';
import { ProductMetrics } from '@/components/ui/IntensityGauge';
import { ProductAccordions } from '@/components/ui/ProductAccordion';
import LayeringSection from '@/components/ui/LayeringSection';
import type { Product } from '@/data/products/men';

export default function ProductShowroom({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const isHomme = product.collection === 'homme';
  const accent = isHomme ? 'var(--color-gold)' : 'var(--color-accent-rose)';
  const accentMuted = isHomme ? 'var(--color-gold-bg-hover)' : 'var(--color-accent-rose-muted)';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );

      // Content reveal stagger
      if (infoRef.current) {
        const els = infoRef.current.querySelectorAll('.reveal-item');
        gsap.fromTo(
          els,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', delay: 0.5 }
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
    <section ref={sectionRef} className="min-h-screen">
      {/* Subtle ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 50% 35% at 25% 50%, ${accentMuted}, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em]">
          <Link href="/" className="text-[var(--color-text-subtle)] hover:text-[var(--color-gold)] transition-colors">
            Accueil
          </Link>
          <span className="text-[var(--color-text-subtle)] opacity-40">/</span>
          <Link href={`/#${isHomme ? 'homme' : 'femme'}`} className="text-[var(--color-text-subtle)] hover:text-[var(--color-gold)] transition-colors">
            {isHomme ? 'W&A Homme' : 'W&A Femme'}
          </Link>
          <span className="text-[var(--color-text-subtle)] opacity-40">/</span>
          <span className="text-[var(--color-text-muted)]">{product.name}</span>
        </nav>

        {/* ─── SPLIT-SCREEN LAYOUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">

          {/* ══════════════ LEFT — STICKY IMAGE ══════════════ */}
          <div ref={imageRef} className="relative opacity-0 lg:sticky lg:top-28 lg:self-start">
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
              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--color-bg)]/50 to-transparent" />
            </div>

            {/* Collection badge */}
            <div className="absolute top-5 left-5">
              <span
                className="text-[0.5rem] uppercase tracking-[0.3em] px-3 py-1.5 backdrop-blur-md"
                style={{
                  color: accent,
                  background: `color-mix(in srgb, ${accent} 8%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
                }}
              >
                {isHomme ? 'W&A Homme' : 'W&A Femme'}
              </span>
            </div>
          </div>

          {/* ══════════════ RIGHT — SCROLLABLE CONTENT ══════════════ */}
          <div ref={infoRef} className="flex flex-col py-4 lg:py-0">

            {/* ── Number ── */}
            <p className="reveal-item text-[0.55rem] uppercase tracking-[0.4em] mb-4" style={{ color: accent }}>
              Parfum N°{product.number}
            </p>

            {/* ── Name ── */}
            <h1 className="reveal-item font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-[3.5rem] font-light tracking-[0.03em] text-[var(--color-text)] leading-tight mb-2">
              {product.name}
            </h1>

            {/* ── Inspiration ── */}
            <p className="reveal-item text-sm text-[var(--color-text-subtle)] italic mb-8">
              Profil olfactif inspiré par {product.inspiredBy}
            </p>

            {/* ── Price & Volume ── */}
            <div className="reveal-item flex items-baseline gap-3 mb-10">
              <span className="font-[family-name:var(--font-cormorant)] text-3xl font-light" style={{ color: accent }}>
                {product.price} DH
              </span>
              <span className="text-[0.6rem] text-[var(--color-text-subtle)] uppercase tracking-[0.2em]">
                | {product.volume}
              </span>
            </div>

            {/* ── Description ── */}
            <p className="reveal-item text-[0.85rem] leading-relaxed text-[var(--color-text-muted)] mb-12 max-w-lg">
              {product.description}
            </p>

            {/* ── Add to Cart Button ── */}
            <div className="reveal-item mb-14">
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-14 py-4 text-[0.65rem] uppercase tracking-[0.3em] font-medium transition-all duration-500 hover:opacity-90"
                style={{
                  backgroundColor: accent,
                  color: 'var(--color-bg)',
                }}
              >
                Ajouter au Panier
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="reveal-item w-full h-px mb-12" style={{ backgroundColor: `color-mix(in srgb, ${accent} 20%, transparent)` }} />

            {/* ── OLFACTORY TIMELINE ── */}
            <div className="reveal-item mb-14">
              <h3 className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-8">
                Pyramide Olfactive
              </h3>
              <OlfactoryTimeline
                topNotes={product.topNotes || []}
                heartNotes={product.heartNotes || []}
                baseNotes={product.baseNotes || []}
                accentColor={accent}
              />
            </div>

            {/* ── INTENSITY GAUGES ── */}
            <div className="reveal-item mb-14">
              <h3 className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-6">
                Performance
              </h3>
              <ProductMetrics
                product={product}
                accentColor={accent}
                className="space-y-4 w-full max-w-sm"
              />
            </div>

            {/* ── Product Details Grid ── */}
            <div className="reveal-item grid grid-cols-2 gap-x-8 gap-y-5 mb-14 max-w-sm">
              <div>
                <span className="text-[0.5rem] text-[var(--color-text-subtle)] uppercase tracking-[0.3em] block mb-1">Famille</span>
                <span className="text-sm text-[var(--color-text)] capitalize">{product.fragranceFamily}</span>
              </div>
              <div>
                <span className="text-[0.5rem] text-[var(--color-text-subtle)] uppercase tracking-[0.3em] block mb-1">Mood</span>
                <span className="text-sm text-[var(--color-text)] capitalize">{product.mood}</span>
              </div>
              <div>
                <span className="text-[0.5rem] text-[var(--color-text-subtle)] uppercase tracking-[0.3em] block mb-1">Saisons</span>
                <span className="text-sm text-[var(--color-text)] capitalize">{product.seasons?.join(', ')}</span>
              </div>
              <div>
                <span className="text-[0.5rem] text-[var(--color-text-subtle)] uppercase tracking-[0.3em] block mb-1">Occasions</span>
                <span className="text-sm text-[var(--color-text)] capitalize">{product.occasions?.slice(0, 2).join(', ')}</span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="reveal-item w-full h-px mb-10" style={{ backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)` }} />

            {/* ── ACCORDIONS ── */}
            <div className="reveal-item mb-14">
              <ProductAccordions />
            </div>

            {/* ── LAYERING SECTION ── */}
            <div className="reveal-item">
              <LayeringSection currentProduct={product} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
