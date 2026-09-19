'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';

export default function CartSlider() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const openWhatsApp = useUIStore((s) => s.openWhatsApp);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getCartTotal = useCartStore((s) => s.getCartTotal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-[var(--color-bg-overlay-medium)] backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[151] w-full max-w-md bg-[var(--color-bg-elevated)] backdrop-blur-xl border-l border-[var(--color-gold-bg-hover)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[var(--color-border-faint)]">
              <h2 className="font-[family-name:var(--font-cormorant)] text-xl tracking-[0.1em] text-[var(--color-text)]">
                Votre Sélection
              </h2>
              <button
                onClick={closeCart}
                className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors duration-300"
                aria-label="Close cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--color-text-muted)] mb-6">
                    Votre sélection vous attend
                  </p>
                  <Link
                    href="/#collections"
                    onClick={closeCart}
                    className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-gold)] border border-[var(--color-gold-border-hover)] px-6 py-3 hover:bg-[var(--color-gold-bg-subtle)] transition-colors duration-300"
                  >
                    Explorer les Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-0">
                  {items.map((item, i) => (
                    <div key={`${item.id}-${item.selectedVolume}`}>
                      <div className="flex gap-4 py-5">
                        {/* Product Image */}
                        <div className="relative w-20 h-24 bg-[var(--color-bg-card)] shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-[family-name:var(--font-cormorant)] text-sm tracking-[0.04em] text-[var(--color-text)] mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-[0.65rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                            {item.selectedVolume}
                          </p>
                          <p className="text-sm sm:text-xs text-[var(--color-gold)] mb-3">
                            {item.selectedPrice} DH
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedVolume, Math.max(1, item.quantity - 1))}
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-border-hover)] hover:text-[var(--color-gold)] transition-colors duration-300 text-xs"
                            >
                              −
                            </button>
                            <span className="text-xs text-[var(--color-text)] w-4 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedVolume, item.quantity + 1)}
                              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-border-hover)] hover:text-[var(--color-gold)] transition-colors duration-300 text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id, item.selectedVolume)}
                          className="self-start text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors duration-300 p-2 -m-2"
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {/* Gold Divider */}
                      {i < items.length - 1 && (
                        <div className="h-[1px] bg-[var(--color-gold-bg-subtle)]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer — Subtotal & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-gold-bg-hover)] px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    Sous-total
                  </span>
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--color-gold)]">
                    {getCartTotal()} DH
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      closeCart();
                      openWhatsApp();
                    }}
                    className="w-full py-4 bg-[#25D366] text-white text-center text-[0.7rem] uppercase tracking-[0.2em] font-medium hover:bg-[#22c55e] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    Commander via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
