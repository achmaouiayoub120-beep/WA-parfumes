'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import EditorialOlfactory from '@/components/ui/EditorialOlfactory';
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

  const [selectedVolumeIdx, setSelectedVolumeIdx] = useState(0);
  const currentVolume = product.volumes ? product.volumes[selectedVolumeIdx] : { size: product.volume, price: product.price };

  const handleAddToCart = () => {
    // Si volumes existe on l'utilise, sinon fallback sur volume/price originaux (sécurité)
    addItem(product, currentVolume.size, currentVolume.price);
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
          <div ref={infoRef} className="flex flex-col pt-32 lg:pt-40 px-6 md:px-12 lg:px-16 pb-20 gap-10">

            <div className="flex flex-col gap-4">
              {/* ── Number ── */}
              <p className="reveal-item text-[0.55rem] uppercase tracking-[0.4em]" style={{ color: accent }}>
                Parfum N°{product.number}
              </p>

              {/* ── Name ── */}
              <h1 className="reveal-item font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-[3.5rem] font-light tracking-[0.03em] text-[var(--color-text)] leading-tight">
                {product.name}
              </h1>

              {/* ── Inspiration ── */}
              <p className="reveal-item text-sm text-[var(--color-text-subtle)] italic">
                Profil olfactif inspiré par {product.inspiredBy}
              </p>
              
              {/* ── Description ── */}
              <p className="reveal-item text-[0.85rem] leading-relaxed text-[var(--color-text-muted)] max-w-lg mt-2">
                {product.description}
              </p>

              {/* ── Price & Volume Selector ── */}
              <div className="reveal-item mt-6 space-y-4">
                <p className="text-[0.55rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)]">
                  Sélectionnez la contenance
                </p>
                <div className="flex flex-wrap gap-3">
                  {(product.volumes || [{ size: product.volume, price: product.price }]).map((vol, idx) => {
                    const isSelected = selectedVolumeIdx === idx;
                    return (
                      <button
                        key={vol.size}
                        onClick={() => setSelectedVolumeIdx(idx)}
                        className={`flex items-center gap-3 px-5 py-3 border transition-all duration-300 ${
                          isSelected 
                            ? 'border-[var(--color-gold)] bg-[var(--color-gold-bg-subtle)]' 
                            : 'border-[var(--color-border)] hover:border-[var(--color-gold-border-hover)]'
                        }`}
                      >
                        <span className={`text-[0.65rem] uppercase tracking-[0.2em] ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}`}>
                          {vol.size}
                        </span>
                        <span className="text-[var(--color-text-subtle)] opacity-40">|</span>
                        <span className={`font-[family-name:var(--font-cormorant)] text-lg ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}>
                          {vol.price} DH
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Add to Cart Button ── */}
            <div className="reveal-item mt-2">
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-12 bg-[#1A1A1A] text-white py-5 uppercase tracking-widest text-[0.7rem] font-medium transition-all duration-500 hover:bg-[#0A0A0A] border border-[#333]"
              >
                Ajouter au Panier — {currentVolume.price} DH
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="reveal-item w-full h-px mt-4" style={{ backgroundColor: `color-mix(in srgb, ${accent} 20%, transparent)` }} />

            {/* ── OLFACTORY TIMELINE ── */}
            <div className="reveal-item">
              <h3 className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-4">
                Architecture du Parfum
              </h3>
              <EditorialOlfactory
                topNotes={product.topNotes || []}
                heartNotes={product.heartNotes || []}
                baseNotes={product.baseNotes || []}
                accentColor={accent}
              />
            </div>

            {/* ── INTENSITY GAUGES ── */}
            <div className="reveal-item">
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
            <div className="reveal-item grid grid-cols-2 gap-x-8 gap-y-5 max-w-sm">
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
            <div className="reveal-item w-full h-px" style={{ backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)` }} />

            {/* ── ACCORDIONS ── */}
            <div className="reveal-item">
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
