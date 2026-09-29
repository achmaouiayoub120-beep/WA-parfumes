'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/data/products/men';

/**
 * DiscoveryBox — Visual gift box showing selected perfumes
 * 
 * - Shows 5 slots arranged in a clean layout
 * - Products animate in/out with scale + rotation
 * - Price counter animates in real-time
 * - Used as sticky sidebar (desktop) or bottom drawer (mobile)
 */
export default function DiscoveryBox({ 
  selectedProducts, 
  maxProducts = 5 
}: { 
  selectedProducts: Product[];
  maxProducts?: number;
}) {
  const slots = Array.from({ length: maxProducts }, (_, i) => selectedProducts[i] || null);

  return (
    <div className="w-full">
      {/* Box Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--color-text)] tracking-wide">
          Votre Coffret
        </h3>
        <motion.span
          key={selectedProducts.length}
          initial={{ scale: 1.3, color: 'var(--color-violet)' }}
          animate={{ scale: 1, color: 'var(--color-text-muted)' }}
          className="text-xs uppercase tracking-[0.2em]"
        >
          {selectedProducts.length}/{maxProducts}
        </motion.span>
      </div>

      {/* Visual Box — top-down view */}
      <div 
        className="relative border border-[var(--color-accent-violet-border)] bg-[var(--color-bg-card)] rounded-lg p-4 overflow-hidden"
        style={{
          boxShadow: '0 4px 30px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(139, 92, 246, 0.1)',
        }}
      >
        {/* Violet corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[var(--color-violet)] opacity-30 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[var(--color-violet)] opacity-30 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[var(--color-violet)] opacity-30 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[var(--color-violet)] opacity-30 rounded-br-lg" />

        {/* Slots Grid — 2-3 layout for 5 items */}
        <div className="grid grid-cols-5 gap-2">
          <AnimatePresence mode="popLayout">
            {slots.map((product, index) => (
              <motion.div
                key={product ? product.id : `empty-${index}`}
                layout
                className="relative aspect-square rounded-md overflow-hidden border"
                style={{
                  borderColor: product 
                    ? 'var(--color-accent-violet-border)' 
                    : 'color-mix(in srgb, var(--color-border-subtle) 50%, transparent)',
                  backgroundColor: product
                    ? 'var(--color-bg-elevated)'
                    : 'color-mix(in srgb, var(--color-bg-elevated) 40%, transparent)',
                }}
              >
                {product ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                    {/* Violet shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(139,92,246,0.1)] to-transparent" />
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[var(--color-text-subtle)] text-xs opacity-30">
                      {index + 1}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Ribbon label */}
        {selectedProducts.length === maxProducts && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-violet)]">
              ✦ Coffret complet ✦
            </span>
          </motion.div>
        )}
      </div>

      {/* Animated Price */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Pack Découverte
        </span>
        <motion.span
          key={selectedProducts.length === maxProducts ? 'full' : 'partial'}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-[family-name:var(--font-cormorant)] text-xl"
          style={{
            color: selectedProducts.length === maxProducts ? 'var(--color-violet)' : 'var(--color-text-muted)',
          }}
        >
          199 DH
        </motion.span>
      </div>
    </div>
  );
}
