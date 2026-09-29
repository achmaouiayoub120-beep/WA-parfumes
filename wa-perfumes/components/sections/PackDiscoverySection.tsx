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
        ${isSelected ? 'border-[var(--color-violet)] shadow-[0_0_15px_rgba(139,92,246,0.25)]' : 'border-[var(--color-border)]'}
        ${isDisabled && !isSelected ? 'opacity-50 grayscale-[50%]' : 'opacity-100'}
        bg-[var(--color-bg-card)]`}
      onClick={() => {
        if (!isDisabled || isSelected) onToggle(product);
      }}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-20 bg-[var(--color-violet)] text-[var(--color-bg)] rounded-full p-1 shadow-md">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      <div className={`relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-bg-elevated)] ${large ? 'md:aspect-square' : ''}`}>
        <Image
          src={product.image || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent opacity-80" />
        
        {/* Pyramide olfactive on hover */}
        <div className="absolute inset-0 bg-[var(--color-bg-card)]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center z-10">
          <p className="text-[var(--color-violet)] text-xs font-semibold mb-3 uppercase tracking-widest">Notes Olfactives</p>
          <div className="space-y-3 text-[var(--color-text)] text-sm">
            <p><span className="text-[var(--color-text-muted)] text-xs block mb-1">Tête</span> {product.topNotes?.join(', ')}</p>
            <p><span className="text-[var(--color-text-muted)] text-xs block mb-1">Cœur</span> {product.heartNotes?.join(', ')}</p>
            <p><span className="text-[var(--color-text-muted)] text-xs block mb-1">Fond</span> {product.baseNotes?.join(', ')}</p>
          </div>
        </div>
      </div>
      
      <div className={`p-4 text-center ${large ? 'md:p-6' : ''}`}>
        <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest mb-1">{product.collection}</p>
        <h3 className={`font-[family-name:var(--font-cormorant)] text-[var(--color-text)] ${large ? 'text-2xl' : 'text-xl'}`}>{product.name}</h3>
        <p className="text-[var(--color-text-subtle)] text-sm mt-2 truncate max-w-full px-2">{product.topNotes?.slice(0, 2).join(', ')}</p>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';

export default function PackDiscoverySection({ variant = 'section' }: { variant?: 'section' | 'fullscreen' }) {
  const { selectedProducts, toggleProduct, openWhatsAppPack } = usePackSelection();
  const [filter, setFilter] = useState<'Tous' | 'W&A Homme' | 'W&A Femme' | 'W&A Unisexe'>('Tous');
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
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

  const allProducts = useMemo(() => [...(MEN_PRODUCTS || []), ...(WOMEN_PRODUCTS || []), ...(UNISEX_PRODUCTS || [])], []);
  
  const filteredProducts = useMemo(() => {
    if (filter === 'W&A Homme') return allProducts.filter(p => p.collection === 'homme');
    if (filter === 'W&A Femme') return allProducts.filter(p => p.collection === 'femme');
    if (filter === 'W&A Unisexe') return allProducts.filter(p => p.collection === 'unisexe');
    return allProducts;
  }, [allProducts, filter]);

  return (
    <section ref={sectionRef} className={`relative bg-[var(--color-bg)] ${variant === 'fullscreen' ? 'py-12 pb-32' : 'py-20'}`}>
      <div className={`container mx-auto px-4 ${variant === 'fullscreen' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
        
        {variant === 'section' && (
          <div className="flex flex-col items-center text-center mb-20 animate-fade-up">
            {/* Symmetrical Subtitle */}
            <div className="flex items-center justify-center gap-4 mb-8 opacity-80">
              <div className="w-12 h-[1px] bg-[var(--color-violet)] opacity-50" />
              <p className="editorial-subtitle text-[var(--color-violet)]">L'Expérience Découverte</p>
              <div className="w-12 h-[1px] bg-[var(--color-violet)] opacity-50" />
            </div>

            {/* Main Title */}
            <h2 className="heading-display text-[var(--color-text)] mb-8 text-5xl md:text-6xl lg:text-7xl">
              Composez <span className="italic text-[var(--color-text-muted)] font-light">Votre Signature</span>
            </h2>

            {/* Features & Price Badge Container */}
            <div className="relative max-w-4xl mx-auto flex flex-col items-center mt-4">
              <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

              {/* 3 Steps / Icons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-14 text-center">
                
                {/* Feature 1 */}
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-violet)] mb-5 group-hover:border-[var(--color-violet)] group-hover:scale-110 transition-all duration-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  </div>
                  <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--color-text)] mb-3">5 Essences Rares</h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Sélectionnez vos formats 30ml parmi nos trois collections emblématiques.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-violet)] mb-5 group-hover:border-[var(--color-violet)] group-hover:scale-110 transition-all duration-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
                  </div>
                  <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--color-text)] mb-3">Rituel Sur-Mesure</h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Une véritable écriture de soi. Façonnez une identité olfactive unique.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-violet)] mb-5 group-hover:border-[var(--color-violet)] group-hover:scale-110 transition-all duration-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--color-text)] mb-3">L&apos;Écrin Absolu</h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Un coffret luxueux conçu pour révéler les multiples facettes de votre personnalité.
                  </p>
                </div>

              </div>

              {/* Price Badge */}
              <div className="inline-flex items-center justify-center gap-6 px-10 py-4 border border-[var(--color-accent-violet-border)] bg-[var(--color-accent-violet-muted)] rounded-full hover:border-[var(--color-violet)] transition-colors duration-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl italic tracking-wide text-[var(--color-text)]">
                  L&apos;Écrin Absolu
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-violet)] animate-pulse" />
                <span className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--color-violet)] font-medium">
                  199 DH
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex justify-center gap-6 md:gap-12 mb-12 animate-fade-up border-b border-[var(--color-border-subtle)]">
          {['Tous', 'W&A Homme', 'W&A Femme', 'W&A Unisexe'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`pb-4 text-sm md:text-base uppercase tracking-wider transition-colors relative
                ${filter === tab ? 'text-[var(--color-violet)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {tab}
              {filter === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-violet)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Two-column layout: Grid + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-up">
          {/* Product Grid */}
          <motion.div 
            layout
            className={`flex-1 grid gap-6
            ${variant === 'fullscreen' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-8'}
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

          {/* Sticky Sidebar — Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28">
              <DiscoveryBox selectedProducts={selectedProducts} />
              
              <div className="mt-6">
                {selectedProducts.length === 5 ? (
                  <button onClick={openWhatsAppPack} className="w-full">
                    <MagneticButton className="w-full bg-[var(--color-plum)] text-[var(--color-cream)] hover:bg-[var(--color-burgundy)] transition-colors px-6 py-3 rounded-full font-medium tracking-wide text-sm">
                      Commander — 199 DH
                    </MagneticButton>
                  </button>
                ) : (
                  <button disabled className="w-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)] px-6 py-3 rounded-full font-medium cursor-not-allowed text-sm">
                    Encore {5 - selectedProducts.length} parfum(s)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Drawer — Mobile only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-glass)] backdrop-blur-md border-t border-[var(--color-border-subtle)] p-4 shadow-2xl">
          <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
            <div className="flex-1">
              <DiscoveryBox selectedProducts={selectedProducts} />
            </div>
            
            <div className="flex-shrink-0">
              {selectedProducts.length === 5 ? (
                <button onClick={openWhatsAppPack}>
                  <MagneticButton className="bg-[var(--color-plum)] text-[var(--color-cream)] hover:bg-[var(--color-burgundy)] transition-colors px-6 py-3 rounded-full font-medium tracking-wide text-xs">
                    199 DH
                  </MagneticButton>
                </button>
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">
                  {5 - selectedProducts.length} restant(s)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
