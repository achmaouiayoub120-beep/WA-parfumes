'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import { UNISEX_PRODUCTS } from '@/data/products/unisex';
import type { Product } from '@/data/products/men';
import MagneticButton from '@/components/ui/MagneticButton';
import DiscoveryBox from '@/components/ui/DiscoveryBox';
import { useUIStore } from '@/store/useUIStore';

// Shared hook for pack selection
export function usePackSelection() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const toggleProduct = useCallback((product: Product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length < 5) {
          return [...prev, product];
        }
        return prev;
      }
    });
  }, []);

  const openWhatsAppPack = useCallback(() => {
    const itemsListText = `• 1x Coffret Découverte 5 Parfums (30ml)\n${selectedProducts.map((p) => `   - ${p.name}`).join('\n')}`;
    
    useUIStore.getState().openWhatsApp({
      type: 'pack',
      itemsText: itemsListText,
      totalText: '199 DH'
    });
  }, [selectedProducts]);

  return { selectedProducts, toggleProduct, openWhatsAppPack };
}

const ProductCard = memo(({ 
  product, 
  isSelected, 
  isDisabled, 
  onToggle,
  large
}: { 
  product: Product; 
  isSelected: boolean; 
  isDisabled: boolean; 
  onToggle: (p: Product) => void;
  large?: boolean;
}) => {
  return (
    <motion.div
      layout
      whileHover={!isDisabled || isSelected ? { scale: 1.02 } : {}}
      whileTap={!isDisabled || isSelected ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 group
        ${isSelected ? 'border-[var(--color-silver)] shadow-[0_0_15px_rgba(201,203,211,0.25)]' : 'border-[var(--color-border-subtle)]'}
        ${isDisabled && !isSelected ? 'opacity-50 grayscale-[40%]' : 'opacity-100'}
        bg-[var(--color-bg-card)]`}
      onClick={() => {
        if (!isDisabled || isSelected) onToggle(product);
      }}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-20 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full p-1 shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      <div className={`relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bg-elevated)] ${large ? 'md:aspect-square' : ''}`}>
        <Image
          src={product.image || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Subtle dark gradient overlay at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent opacity-60" />
      </div>
      
      <div className={`p-3 sm:p-4 text-center ${large ? 'md:p-6' : ''}`}>
        <p className="text-[var(--color-text-subtle)] text-[0.65rem] uppercase tracking-widest mb-1">{product.collection}</p>
        <h3 className={`font-[family-name:var(--font-cormorant)] text-[var(--color-text)] ${large ? 'text-xl' : 'text-base sm:text-lg'} font-light line-clamp-1`}>{product.name}</h3>
        <p className="text-[var(--color-text-muted)] text-xs mt-1 truncate max-w-full px-1">{product.topNotes?.slice(0, 2).join(', ')}</p>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';

export default function PackDiscoverySection({ variant = 'section' }: { variant?: 'section' | 'fullscreen' }) {
  const { selectedProducts, toggleProduct, openWhatsAppPack } = usePackSelection();
  const [filter, setFilter] = useState<'Tous' | 'W&A Homme' | 'W&A Femme' | 'W&A Unisexe'>('Tous');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.animate-fade-up'),
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        }
      );
    }
  }, [variant]);

  // Observer to track if the Pack section is in viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Lock scroll when bottom sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  const allProducts = useMemo(() => [...(MEN_PRODUCTS || []), ...(WOMEN_PRODUCTS || []), ...(UNISEX_PRODUCTS || [])], []);
  
  const filteredProducts = useMemo(() => {
    if (filter === 'W&A Homme') return allProducts.filter(p => p.collection === 'homme');
    if (filter === 'W&A Femme') return allProducts.filter(p => p.collection === 'femme');
    if (filter === 'W&A Unisexe') return allProducts.filter(p => p.collection === 'unisexe');
    return allProducts;
  }, [allProducts, filter]);

  const showPill = !isMobileMenuOpen && (selectedProducts.length > 0 || isSectionInView);

  return (
    <section ref={sectionRef} className={`relative bg-[var(--color-bg)] ${variant === 'fullscreen' ? 'py-12 pb-32' : 'py-20'}`}>
      <div className={`container mx-auto px-4 ${variant === 'fullscreen' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
        
        {variant === 'section' && (
          <div className="flex flex-col items-center text-center mb-16 animate-fade-up">
            {/* Symmetrical Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6 opacity-90">
              <div className="w-10 h-[1px] bg-[var(--color-silver)] opacity-40" />
              <p className="editorial-subtitle text-[var(--color-silver)]">L&apos;Expérience Découverte</p>
              <div className="w-10 h-[1px] bg-[var(--color-silver)] opacity-40" />
            </div>

            {/* Main Title */}
            <h2 className="heading-display text-[var(--color-text)] mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Composez <span className="italic text-[var(--color-text-muted)] font-light">Votre Signature</span>
            </h2>

            {/* Features & Price Badge Container */}
            <div className="relative max-w-4xl mx-auto flex flex-col items-center mt-2">
              {/* 3 Steps / Icons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 text-center">
                
                {/* Feature 1 */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-silver)] mb-4 group-hover:border-[var(--color-silver)] group-hover:scale-105 transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  </div>
                  <h3 className="text-xs md:text-sm uppercase tracking-[0.18em] text-[var(--color-text)] mb-2 font-medium">5 Essences Rares</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Sélectionnez vos 5 flacons 30ml parmi l&apos;ensemble de nos collections.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-silver)] mb-4 group-hover:border-[var(--color-silver)] group-hover:scale-105 transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
                  </div>
                  <h3 className="text-xs md:text-sm uppercase tracking-[0.18em] text-[var(--color-text)] mb-2 font-medium">Rituel Sur-Mesure</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Une véritable écriture olfactive façonnée selon vos envies et occasions.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-silver)] mb-4 group-hover:border-[var(--color-silver)] group-hover:scale-105 transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <h3 className="text-xs md:text-sm uppercase tracking-[0.18em] text-[var(--color-text)] mb-2 font-medium">L&apos;Écrin Absolu</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Un coffret luxueux pour explorer et porter chaque jour une nouvelle signature.
                  </p>
                </div>

              </div>

              {/* Price Badge — luxury gold/cream palette */}
              <div className="inline-flex items-center justify-center gap-4 px-6 py-2.5 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] rounded-full">
                <span className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl italic tracking-wide text-[var(--color-text)]">
                  Coffret Découverte
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-silver)]" />
                <span className="font-sans text-xs sm:text-sm tracking-[0.15em] uppercase text-[var(--color-silver)] font-medium">
                  5 × 30ml — 199 DH
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex justify-center gap-4 sm:gap-8 mb-10 animate-fade-up border-b border-[var(--color-border-subtle)] overflow-x-auto">
          {['Tous', 'W&A Homme', 'W&A Femme', 'W&A Unisexe'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab as 'Tous' | 'W&A Homme' | 'W&A Femme' | 'W&A Unisexe')}
              className={`pb-3 text-xs sm:text-sm uppercase tracking-wider transition-colors relative whitespace-nowrap min-h-[44px] flex items-center justify-center
                ${filter === tab ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {tab}
              {filter === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-silver)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Two-column layout: Grid + Sidebar */}
        <div className="flex flex-col md:flex-row gap-8 animate-fade-up">
          {/* Product Grid */}
          <motion.div 
            layout
            className={`flex-1 grid gap-4 sm:gap-6
            ${variant === 'fullscreen' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'}
          `}>
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.some(p => p.id === product.id)}
                  isDisabled={selectedProducts.length >= 5}
                  onToggle={toggleProduct}
                  large={variant === 'fullscreen'}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Sticky Sidebar — Desktop & Tablet */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <DiscoveryBox selectedProducts={selectedProducts} onRemove={toggleProduct} />
              
              <div className="mt-6">
                {selectedProducts.length === 5 ? (
                  <MagneticButton onClick={openWhatsAppPack} className="w-full h-12 bg-[var(--color-text)] text-[var(--color-bg)] hover:bg-[var(--color-silver)] transition-colors px-6 rounded-full font-semibold tracking-wide text-xs uppercase flex items-center justify-center">Commander — 199 DH</MagneticButton>
                ) : (
                  <button disabled className="w-full h-12 bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] px-6 rounded-full font-medium cursor-not-allowed text-xs uppercase tracking-wider">
                    Encore {5 - selectedProducts.length} parfum(s)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ COMPACT PASTILLE (Mobile only, ≤ 48px) ═══════════════ */}
        <AnimatePresence>
          {showPill && !isSheetOpen && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed z-40 left-4"
              style={{
                bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
              }}
            >
              <button
                onClick={() => setIsSheetOpen(true)}
                className="h-12 max-h-[48px] px-4 rounded-full flex items-center gap-2.5 shadow-xl transition-all duration-300 border border-[var(--color-silver)]"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 92%, transparent)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
                aria-label="Ouvrir le coffret découverte"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--color-silver)] text-[var(--color-bg)] flex items-center justify-center text-xs font-bold shrink-0">
                  {selectedProducts.length}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[0.68rem] font-semibold tracking-wide uppercase text-[var(--color-text)]">
                    Coffret {selectedProducts.length}/5
                  </span>
                  <span className="text-[0.58rem] text-[var(--color-silver)] font-medium">
                    199 DH
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 text-[var(--color-text-muted)]">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════ BOTTOM SHEET (Panneau du bas) ═══════════════ */}
        <AnimatePresence>
          {isSheetOpen && !isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSheetOpen(false)}
                className="md:hidden fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
              />

              {/* Sheet container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="md:hidden fixed left-0 right-0 bottom-0 z-[151] rounded-t-3xl border-t border-[var(--color-border)] shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  maxHeight: '85dvh',
                  paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
                }}
              >
                {/* Pull handle & header */}
                <div className="pt-3 pb-2 px-5 flex flex-col items-center border-b border-[var(--color-border-subtle)]">
                  <div className="w-10 h-1 rounded-full bg-[var(--color-border)] mb-3" />
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text)]">
                        Votre Coffret Découverte
                      </h3>
                      <p className="text-[0.65rem] text-[var(--color-text-muted)] uppercase tracking-wider">
                        5 flacons de 30ml — 199 DH
                      </p>
                    </div>
                    {/* Close button — 44×44px */}
                    <button
                      onClick={() => setIsSheetOpen(false)}
                      className="w-11 h-11 flex items-center justify-center rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
                      aria-label="Fermer le coffret"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(70dvh - 120px)' }}>
                  <DiscoveryBox selectedProducts={selectedProducts} onRemove={toggleProduct} />
                </div>

                {/* Bottom CTA */}
                <div className="px-5 pt-3">
                  {selectedProducts.length === 5 ? (
                    <button
                      onClick={() => {
                        setIsSheetOpen(false);
                        openWhatsAppPack();
                      }}
                      className="w-full h-[52px] bg-[var(--color-text)] text-[var(--color-bg)] rounded-full font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
                    >
                      <span>Commander le Coffret — 199 DH</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSheetOpen(false)}
                      className="w-full h-[52px] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] rounded-full text-xs uppercase tracking-wider font-medium flex items-center justify-center"
                    >
                      Encore {5 - selectedProducts.length} parfum(s) à choisir
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
