'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
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
        ${isSelected ? 'border-[var(--color-gold)] shadow-[0_0_15px_var(--color-gold-muted)]' : 'border-[var(--color-border)]'}
        ${isDisabled && !isSelected ? 'opacity-50 grayscale-[50%]' : 'opacity-100'}
        bg-[var(--color-bg-card)]`}
      onClick={() => {
        if (!isDisabled || isSelected) onToggle(product);
      }}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-20 bg-[var(--color-gold)] text-[var(--color-bg)] rounded-full p-1 shadow-md">
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
          <p className="text-[var(--color-gold)] text-xs font-semibold mb-3 uppercase tracking-widest">Notes Olfactives</p>
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
  const [filter, setFilter] = useState<'Tous' | 'W&A Homme' | 'W&A Femme'>('Tous');
  
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

  const allProducts = useMemo(() => [...(MEN_PRODUCTS || []), ...(WOMEN_PRODUCTS || [])], []);
  
  const filteredProducts = useMemo(() => {
    if (filter === 'W&A Homme') return allProducts.filter(p => p.collection === 'homme');
    if (filter === 'W&A Femme') return allProducts.filter(p => p.collection === 'femme');
    return allProducts;
  }, [allProducts, filter]);

  return (
    <section ref={sectionRef} className={`relative bg-[var(--color-bg)] ${variant === 'fullscreen' ? 'py-12 pb-32' : 'py-20'}`}>
      <div className={`container mx-auto px-4 ${variant === 'fullscreen' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
        
        {variant === 'section' && (
          <div className="text-center mb-12 animate-fade-up">
            <p className="editorial-subtitle text-[var(--color-gold)] mb-4">L'Expérience Découverte</p>
            <h2 className="heading-display text-[var(--color-text)] mb-6 text-4xl md:text-5xl">
              Composez Votre Signature
            </h2>
            <p className="body-large text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Explorez notre collection et choisissez 5 parfums (format 30ml) pour créer votre coffret découverte personnalisé. Un voyage olfactif exclusif pour 199 DH.
            </p>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex justify-center gap-6 md:gap-12 mb-12 animate-fade-up border-b border-[var(--color-border-subtle)]">
          {['Tous', 'W&A Homme', 'W&A Femme'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`pb-4 text-sm md:text-base uppercase tracking-wider transition-colors relative
                ${filter === tab ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {tab}
              {filter === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-gold)]"
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
                    <MagneticButton className="w-full bg-[var(--color-gold)] text-[var(--color-bg)] px-6 py-3 rounded-full font-medium tracking-wide text-sm">
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
                  <MagneticButton className="bg-[var(--color-gold)] text-[var(--color-bg)] px-6 py-3 rounded-full font-medium tracking-wide text-xs">
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
