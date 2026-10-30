'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: 'homme' | 'femme' | 'unisexe';
  inspirationNote?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  volume?: string;
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product as any, product.volume || '50ml', product.price);
    openCart();
  };

  const collectionLabel =
    product.collection === 'homme'
      ? 'Homme'
      : product.collection === 'unisexe'
      ? 'Unisexe'
      : 'Femme';

  const badgeColor =
    product.collection === 'homme'
      ? 'var(--color-silver)'
      : product.collection === 'unisexe'
      ? 'var(--color-violet)'
      : 'var(--color-accent-rose)';

  const badgeBg =
    product.collection === 'homme'
      ? 'var(--color-accent-muted)'
      : product.collection === 'unisexe'
      ? 'var(--color-accent-violet-muted)'
      : 'var(--color-accent-rose-muted)';

  const badgeBorder =
    product.collection === 'homme'
      ? 'var(--color-accent-border)'
      : product.collection === 'unisexe'
      ? 'var(--color-accent-violet-border)'
      : 'var(--color-accent-rose-border)';

  return (
    <Link href={`/product/${product.id}`} className="block group h-full">
      <div
        className="relative overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border-faint)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full flex flex-col justify-between"
        style={{
          boxShadow: 'var(--color-card-shadow)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Desktop-only: Silver spotlight on hover (soft base glow) */}
        <div
          className="hidden md:block absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 50%, var(--color-accent-bg-hover) 0%, transparent 70%)`,
          }}
        />

        {/* Desktop-only: Sliding linear highlight simulating glass reflection */}
        <div
          className="hidden md:block absolute inset-0 z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
          style={{
            background: `linear-gradient(105deg, transparent 20%, var(--color-accent) 50%, transparent 80%)`,
            transform: `translateX(0)`,
          }}
        />

        {/* Hover border glow */}
        <div className="absolute inset-0 z-10 border border-transparent group-hover:border-[var(--color-accent-border)] transition-colors duration-500 pointer-events-none" />

        {/* Collection Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
          <span
            className="text-[0.48rem] sm:text-[0.55rem] uppercase tracking-[0.25em] px-2 py-0.5 sm:px-2.5 sm:py-1 backdrop-blur-sm rounded-sm font-medium"
            style={{
              color: badgeColor,
              background: badgeBg,
              border: `1px solid ${badgeBorder}`,
            }}
          >
            {collectionLabel}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-bg-elevated)] shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />

          {/* Desktop-only: Inner pulsing silver glow on the bottle image */}
          <div className="hidden md:block absolute inset-0 shadow-[inset_0_0_0_1px_rgba(201,203,211,0)] group-hover:shadow-[inset_0_0_20px_rgba(201,203,211,0.15)] transition-shadow duration-700 pointer-events-none" />

          {/* Desktop-only: Notes on hover */}
          {product.topNotes && product.topNotes.length > 0 && (
            <div
              className={`hidden md:flex absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 gap-1.5 flex-wrap transition-all duration-500 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {product.topNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={note}
                  className="text-[0.45rem] sm:text-[0.55rem] uppercase tracking-[0.2em] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[var(--color-bg-overlay-medium)] backdrop-blur-sm text-[var(--color-accent)] border border-[var(--color-accent-border)] rounded-sm transition-all duration-500"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
                    transitionDelay: isHovered ? `${idx * 100}ms` : '0ms'
                  }}
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-cormorant)] text-base sm:text-lg tracking-[0.04em] text-[var(--color-text)] mb-1 group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>

            {product.inspirationNote && (
              <p className="text-[0.65rem] text-[var(--color-text-subtle)] mb-2 italic line-clamp-1">
                {product.inspirationNote}
              </p>
            )}

            {/* Mobile-only visible notes */}
            {product.topNotes && product.topNotes.length > 0 && (
              <p className="md:hidden text-[0.68rem] text-[var(--color-text-muted)] line-clamp-1 mb-2 font-normal">
                {product.topNotes.slice(0, 2).join(', ')}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border-subtle)] mt-auto">
            <p className="text-sm font-medium text-[var(--color-accent)] font-[family-name:var(--font-sans)] tracking-wider">
              {product.price} DH
            </p>

            {/* Mobile 44px Add button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="md:hidden min-h-[38px] px-3 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-transform"
              aria-label={`Ajouter ${product.name} au panier`}
            >
              <span>Ajouter</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
