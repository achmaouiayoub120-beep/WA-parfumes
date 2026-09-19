'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MEN_PRODUCTS, Product } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

interface ScentFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Q1 = 'Pour Lui' | 'Pour Elle' | 'Mixte' | null;
type Q2 = 'Fraîcheur matinale' | 'Nuit mystérieuse' | 'Salon feutré' | null;
type Q3 = 'Élégance' | 'Charisme / Séduction' | null;

export default function ScentFinderModal({ isOpen, onClose }: ScentFinderModalProps) {
  const [step, setStep] = useState(0);
  const [q1, setQ1] = useState<Q1>(null);
  const [q2, setQ2] = useState<Q2>(null);
  const [q3, setQ3] = useState<Q3>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  // Combine all products for searching
  const allProducts = useMemo(() => [...(MEN_PRODUCTS || []), ...(WOMEN_PRODUCTS || [])], []);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const getRecommendation = (): Product | undefined => {
    // Si [Mixte / Joker] : Retourne Baccarat Rouge 540 (wa-sig-06)
    if (q1 === 'Mixte') return allProducts.find(p => p.id === 'wa-sig-06');

    if (q1 === 'Pour Lui') {
      // Si [Homme + Nuit + Charisme] : Retourne Azzaro The Most Wanted (wa-sig-08)
      if (q2 === 'Nuit mystérieuse' && q3 === 'Charisme / Séduction') return allProducts.find(p => p.id === 'wa-sig-08');
      
      // Si [Homme + Nuit + Élégance] : Retourne Dior Homme Intense (wa-sig-07)
      if (q2 === 'Nuit mystérieuse' && q3 === 'Élégance') return allProducts.find(p => p.id === 'wa-sig-07');
      
      // Si [Homme + Matin + Élégance/Charisme] : Retourne Imagination (wa-sig-12) 
      if (q2 === 'Fraîcheur matinale') return allProducts.find(p => p.id === 'wa-sig-12');
      
      // Si [Homme + Salon Feutré + Séduction] : Retourne Stronger With You Intensely (wa-sig-01)
      if (q2 === 'Salon feutré') return allProducts.find(p => p.id === 'wa-sig-01');
      
      // Default fallback for Him
      return allProducts.find(p => p.id === 'wa-sig-01');
    }

    if (q1 === 'Pour Elle') {
      // Si [Femme + Nuit + Charisme/Séduction] : Retourne Givenchy L'Interdit Rouge (wa-ele-04)
      if (q2 === 'Nuit mystérieuse' && q3 === 'Charisme / Séduction') return allProducts.find(p => p.id === 'wa-ele-04');
      
      // Si [Femme + Nuit + Élégance] : Retourne Chanel Coco Mademoiselle Intense (wa-ele-09)
      if (q2 === 'Nuit mystérieuse' && q3 === 'Élégance') return allProducts.find(p => p.id === 'wa-ele-09');
      
      // Si [Femme + Matin + Élégance] : Retourne D&G L'Impératrice (wa-ele-05)
      if (q2 === 'Fraîcheur matinale') return allProducts.find(p => p.id === 'wa-ele-05');
      
      // Si [Femme + Salon Feutré + Séduction] : Retourne Kayali Vanilla 28 (wa-ele-03)
      if (q2 === 'Salon feutré') return allProducts.find(p => p.id === 'wa-ele-03');
      
      // Default fallback for Her
      return allProducts.find(p => p.id === 'wa-ele-01');
    }

    return allProducts.find(p => p.id === 'wa-sig-06');
  };

  const handleAddToCart = () => {
    const recommendedProduct = getRecommendation();
    if (recommendedProduct) {
      const defaultVol = recommendedProduct.volumes ? recommendedProduct.volumes[0] : { size: recommendedProduct.volume, price: recommendedProduct.price };
      addItem(recommendedProduct, defaultVol.size, defaultVol.price);
      onClose();
      // Small delay to allow modal to close before opening cart
      setTimeout(() => openCart(), 300);
    }
  };

  const reset = () => {
    setStep(0);
    setQ1(null);
    setQ2(null);
    setQ3(null);
  };

  // When modal closes, reset after animation
  React.useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => reset(), 500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const recommendedProduct = step === 3 ? getRecommendation() : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xl"
        >
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={onClose}
              className="text-white hover:text-[var(--color-gold)] transition-colors p-2"
              aria-label="Fermer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-full max-w-2xl px-6 relative">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center gap-8"
                >
                  <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Pour qui cherchez-vous cette signature ?</h2>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                    {['Pour Lui', 'Pour Elle', 'Mixte'].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          setQ1(choice as Q1);
                          if (choice === 'Mixte') {
                            setStep(3); // Skip straight to revelation
                          } else {
                            handleNext();
                          }
                        }}
                        className="flex-1 py-4 px-6 border border-white/20 rounded-none text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:bg-white/5 transition-all duration-300 font-sans tracking-widest uppercase text-xs"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center gap-8"
                >
                  <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Quelle atmosphère vous inspire ?</h2>
                  <div className="flex flex-col gap-4 w-full max-w-lg">
                    {['Fraîcheur matinale', 'Nuit mystérieuse', 'Salon feutré'].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          setQ2(choice as Q2);
                          handleNext();
                        }}
                        className="w-full py-4 px-6 border border-white/20 rounded-none text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:bg-white/5 transition-all duration-300 font-sans tracking-widest uppercase text-xs"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center gap-8"
                >
                  <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Quelle est l'attitude recherchée ?</h2>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                    {['Élégance', 'Charisme / Séduction'].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          setQ3(choice as Q3);
                          handleNext();
                        }}
                        className="flex-1 py-4 px-6 border border-white/20 rounded-none text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:bg-white/5 transition-all duration-300 font-sans tracking-widest uppercase text-xs"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && recommendedProduct && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center gap-8"
                >
                  <p className="text-[var(--color-gold)] font-sans tracking-[0.2em] uppercase text-xs">
                    Vos choix nous ont menés à une évidence :
                  </p>
                  
                  <h2 className="text-4xl md:text-6xl font-serif text-white">
                    {recommendedProduct.name}
                  </h2>
                  <p className="text-white/60 text-sm md:text-base font-serif italic max-w-md">
                    Inspiré par {recommendedProduct.inspiredBy}
                  </p>

                  <div className="relative w-48 h-64 md:w-64 md:h-80 mt-4 mb-4">
                    {/* Dramatic light behind bottle */}
                    <div className="absolute inset-0 bg-[var(--color-gold)] blur-[80px] opacity-20 rounded-full" />
                    <Image 
                      src={recommendedProduct.image} 
                      alt={recommendedProduct.name}
                      fill
                      className="object-cover rounded-sm relative z-10 drop-shadow-2xl"
                    />
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-12 py-5 bg-[var(--color-gold)] text-black font-sans uppercase tracking-widest text-xs font-semibold hover:bg-white transition-colors duration-500"
                  >
                    Ajouter au coffret — 50 DH
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
