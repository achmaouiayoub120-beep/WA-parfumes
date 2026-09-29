'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: 'homme' | 'femme' | 'unisexe';
  inspirationNote?: string;
  topNotes?: string[];
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className="relative overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border-faint)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          boxShadow: 'var(--color-card-shadow)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Silver spotlight on hover (soft base glow) */}
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 50%, var(--color-accent-bg-hover) 0%, transparent 70%)`,
          }}
        />

        {/* Sliding linear highlight simulating glass reflection */}
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
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
            className="text-[0.45rem] sm:text-[0.55rem] uppercase tracking-[0.25em] px-2 py-0.5 sm:px-2.5 sm:py-1 backdrop-blur-sm rounded-sm"
            style={{
              color:
                product.collection === 'homme'
                  ? 'var(--color-silver)'
                  : product.collection === 'unisexe'
                  ? 'var(--color-violet)'
                  : 'var(--color-accent-rose)',
              background:
                product.collection === 'homme'
                  ? 'var(--color-accent-muted)'
                  : product.collection === 'unisexe'
                  ? 'var(--color-accent-violet-muted)'
                  : 'var(--color-accent-rose-muted)',
              border: `1px solid ${
                product.collection === 'homme'
                  ? 'var(--color-accent-border)'
                  : product.collection === 'unisexe'
                  ? 'var(--color-accent-violet-border)'
                  : 'var(--color-accent-rose-border)'
              }`,
            }}
          >
            {product.collection === 'homme'
              ? 'Homme'
              : product.collection === 'unisexe'
              ? 'Unisexe'
              : 'Femme'}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
          />

          {/* Inner pulsing silver glow on the bottle image */}
          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(201,203,211,0)] group-hover:shadow-[inset_0_0_20px_rgba(201,203,211,0.15)] transition-shadow duration-700 pointer-events-none" />

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent" />

          {/* Notes on hover */}
          {product.topNotes && product.topNotes.length > 0 && (
            <div
              className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex gap-1.5 flex-wrap transition-all duration-500 ${
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
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="font-[family-name:var(--font-cormorant)] text-base sm:text-lg tracking-[0.04em] text-[var(--color-text)] mb-1 group-hover:text-[var(--color-accent)] transition-colors duration-300">
            {product.name}
          </h3>

          {product.inspirationNote && (
            <p className="text-[0.65rem] text-[var(--color-text-subtle)] mb-3 italic">
              {product.inspirationNote}
            </p>
          )}

          <p className="text-sm text-[var(--color-accent)] font-[family-name:var(--font-sans)] tracking-wider">
            {product.price} DH
          </p>
        </div>
      </div>
    </Link>
  );
}
