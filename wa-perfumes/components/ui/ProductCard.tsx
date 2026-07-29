'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: 'signature' | 'elegance';
  inspirationNote?: string;
  topNotes?: string[];
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotX, setSpotX] = useState(50);
  const [spotY, setSpotY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setRotateX((0.5 - y) * 8);
    setRotateY((x - 0.5) * 8);
    setSpotX(x * 100);
    setSpotY(y * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        ref={cardRef}
        className="relative overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border-faint)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          boxShadow: 'var(--color-card-shadow)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gold spotlight on hover */}
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${spotX}% ${spotY}%, var(--color-gold-bg-hover) 0%, transparent 60%)`,
          }}
        />

        {/* Hover border glow */}
        <div className="absolute inset-0 z-10 border border-transparent group-hover:border-[var(--color-gold-border)] transition-colors duration-500 pointer-events-none" />

        {/* Collection Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span
            className="text-[0.55rem] uppercase tracking-[0.25em] px-2.5 py-1 backdrop-blur-sm rounded-sm"
            style={{
              color: product.collection === 'signature' ? 'var(--color-gold)' : 'var(--color-accent-rose)',
              background:
                product.collection === 'signature'
                  ? 'var(--color-gold-muted)'
                  : 'var(--color-accent-rose-muted)',
              border: `1px solid ${
                product.collection === 'signature'
                  ? 'var(--color-gold-border)'
                  : 'var(--color-accent-rose-border)'
              }`,
            }}
          >
            {product.collection === 'signature' ? 'Signature' : 'Elegance'}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
          />

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent" />

          {/* Notes on hover */}
          {product.topNotes && product.topNotes.length > 0 && (
            <div
              className={`absolute bottom-4 left-4 right-4 z-20 flex gap-2 flex-wrap transition-all duration-500 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {product.topNotes.slice(0, 3).map((note) => (
                <span
                  key={note}
                  className="text-[0.55rem] uppercase tracking-[0.2em] px-2 py-1 bg-[var(--color-bg-overlay-medium)] backdrop-blur-sm text-[var(--color-gold)] border border-[var(--color-gold-border)] rounded-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-[family-name:var(--font-cormorant)] text-lg tracking-[0.04em] text-[var(--color-text)] mb-1 group-hover:text-[var(--color-gold)] transition-colors duration-300">
            {product.name}
          </h3>

          {product.inspirationNote && (
            <p className="text-[0.65rem] text-[var(--color-text-subtle)] mb-3 italic">
              {product.inspirationNote}
            </p>
          )}

          <p className="text-sm text-[var(--color-gold)] font-[family-name:var(--font-sans)] tracking-wider">
            {product.price} DH
          </p>
        </div>
      </div>
    </Link>
  );
}
