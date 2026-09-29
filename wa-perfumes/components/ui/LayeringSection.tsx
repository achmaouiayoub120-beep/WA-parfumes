'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type Product, MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import { UNISEX_PRODUCTS } from '@/data/products/unisex';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

interface LayeringSectionProps {
  currentProduct: Product;
}

export default function LayeringSection({ currentProduct }: LayeringSectionProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  // Logic for selecting a recommended product for fragrance layering
  const recommendedProduct = useMemo(() => {
    if (!currentProduct) return null;

    const allProducts: Product[] = [...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...UNISEX_PRODUCTS];
    const candidates = allProducts.filter((p) => p.id !== currentProduct.id);

    if (candidates.length === 0) return null;

    const currentFamily = (currentProduct.fragranceFamily || '').trim().toLowerCase();
    const currentBaseNotes = (currentProduct.baseNotes || []).map((n) => n.trim().toLowerCase());

    // 1. Match candidate with DIFFERENT fragranceFamily but overlapping baseNotes (at least 1 common note)
    const match = candidates.find((p) => {
      const candidateFamily = (p.fragranceFamily || '').trim().toLowerCase();
      const isDifferentFamily = candidateFamily !== currentFamily;
      if (!isDifferentFamily) return false;

      const candidateBaseNotes = (p.baseNotes || []).map((n) => n.trim().toLowerCase());
      return candidateBaseNotes.some((note) => currentBaseNotes.includes(note));
    });

    if (match) {
      return match;
    }

    // 2. If no match, pick a product from the same gender
    const sameGenderCandidates = candidates.filter((p) => p.gender === currentProduct.gender);
    const fallbackPool = sameGenderCandidates.length > 0 ? sameGenderCandidates : candidates;

    // Use deterministic hash of currentProduct.id to reliably select a candidate
    const hash = currentProduct.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = Math.abs(hash) % fallbackPool.length;

    return fallbackPool[index];
  }, [currentProduct]);

  if (!recommendedProduct) return null;

  const handleAddToCart = () => {
    const defaultVol = recommendedProduct.volumes ? recommendedProduct.volumes[0] : { size: recommendedProduct.volume, price: recommendedProduct.price };
    addItem(recommendedProduct, defaultVol.size, defaultVol.price);
    openCart();
  };

  const formattedPrice = `${recommendedProduct.price} ${recommendedProduct.currency || 'DH'} | ${
    recommendedProduct.volume ? recommendedProduct.volume.toUpperCase() : '30ML'
  }`;

  return (
    <section className="w-full my-8">
      <div className="mb-4">
        <h3
          className="text-[1.5rem] font-serif text-[var(--color-text)] tracking-wide font-medium"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          L&apos;Art du Layering
        </h3>
        <p className="text-sm italic text-[var(--color-text-muted)] mt-1">
          Sublimez votre signature en superposant deux créations complémentaires
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-[var(--color-border-faint)] bg-transparent hover:border-[var(--color-border-subtle)] transition-colors duration-300 gap-4"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Small product image (80x100px, rounded) */}
          <div className="relative w-[80px] h-[100px] flex-shrink-0 overflow-hidden rounded-md border border-[var(--color-border-faint)] bg-[var(--color-bg-card)]">
            <Image
              src={recommendedProduct.image}
              alt={recommendedProduct.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-1 min-w-0">
            <Link
              href={`/product/${recommendedProduct.id}`}
              className="text-base font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-200 truncate"
            >
              {recommendedProduct.name}
            </Link>
            {recommendedProduct.inspiredBy && (
              <p className="text-xs text-[var(--color-text-muted)] italic truncate">
                Inspiré par {recommendedProduct.inspiredBy}
              </p>
            )}
            <p className="text-xs font-semibold text-[var(--color-accent)] tracking-wider mt-1">
              {formattedPrice}
            </p>
          </div>
        </div>

        {/* 'Ajouter aussi' button (border style, not filled) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium uppercase tracking-widest border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors duration-300 rounded-sm whitespace-nowrap"
        >
          Ajouter aussi
        </button>
      </motion.div>
    </section>
  );
}
