'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function CartSlider() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const openWhatsApp = useUIStore((s) => s.openWhatsApp);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getCartTotal = useCartStore((s) => s.getCartTotal);
  const mounted = useIsMounted();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
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
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer / Bottom Sheet */}
          <motion.div
            initial={{ opacity: 0, y: '20%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '20%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed z-[151] bg-[var(--color-bg-elevated)] backdrop-blur-xl border-[var(--color-border)] flex flex-col
              max-md:inset-x-0 max-md:bottom-0 max-md:rounded-t-2xl max-md:max-h-[88dvh] max-md:border-t
              md:top-0 md:right-0 md:bottom-0 md:w-full md:max-w-md md:border-l"
            style={{
              overscrollBehavior: 'contain',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {/* Mobile Drag Indicator */}
            <div className="md:hidden pt-3 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-[var(--color-border)]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 md:py-6 border-b border-[var(--color-border-faint)]">
              <h2 className="font-[family-name:var(--font-cormorant)] text-xl tracking-[0.05em] text-[var(--color-text)]">
                Votre Sélection ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Fermer le panier"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4" style={{ overscrollBehavior: 'contain' }}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <p className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text-muted)] mb-6">
                    Votre sélection est vide
                  </p>
                  <Link
                    href="/#collections"
                    onClick={closeCart}
                    className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] border border-[var(--color-accent-border)] px-6 py-3.5 rounded-full hover:bg-[var(--color-accent-bg-subtle)] transition-colors font-medium"
                  >
                    Découvrir les Collections
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedVolume}`} className="py-4 flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-18 h-22 sm:w-20 sm:h-24 bg-[var(--color-bg-card)] rounded-md shrink-0 overflow-hidden border border-[var(--color-border-faint)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-[family-name:var(--font-cormorant)] text-base text-[var(--color-text)] truncate">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id, item.selectedVolume)}
                              className="text-[var(--color-text-subtle)] hover:text-red-400 transition-colors p-1"
                              aria-label={`Retirer ${item.name}`}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-[11px] text-[var(--color-text-subtle)] uppercase tracking-wider mt-0.5">
                            {item.selectedVolume}
                          </p>
                          <p className="text-sm font-semibold text-[var(--color-text)] mt-1">
                            {item.selectedPrice} DH
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedVolume, Math.max(1, item.quantity - 1))}
                            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors text-sm"
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>
                          <span className="text-xs text-[var(--color-text)] w-5 text-center font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedVolume, item.quantity + 1)}
                            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors text-sm"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer — Subtotal & WhatsApp Checkout */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-border-subtle)] px-6 pt-4 pb-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.15em] text-[var(--color-text-muted)] font-medium">
                    Sous-total
                  </span>
                  <span className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-[var(--color-text)]">
                    {getCartTotal()} DH
                  </span>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    openWhatsApp();
                  }}
                  className="w-full h-13 min-h-[50px] bg-[#25D366] text-white rounded-full text-xs uppercase tracking-[0.15em] font-semibold hover:bg-[#22c55e] transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Commander via WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
