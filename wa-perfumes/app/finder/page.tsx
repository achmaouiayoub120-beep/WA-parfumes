'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import Image from 'next/image';
import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';

type Question = {
  id: string;
  question: string;
  options: { label: string; value: string; image?: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'gender',
    question: "Pour qui cherchez-vous ?",
    options: [
      { label: "Pour Lui (WA Signature)", value: "men" },
      { label: "Pour Elle (WA Elegance)", value: "women" }
    ]
  },
  {
    id: 'mood',
    question: "Quelle ambiance vous définit ?",
    options: [
      { label: "Audacieux & Mystérieux", value: "bold" },
      { label: "Frais & Énergique", value: "fresh" },
      { label: "Chaud & Sensuel", value: "warm" },
      { label: "Élégant & Raffiné", value: "elegant" }
    ]
  },
  {
    id: 'note',
    question: "Quel profil olfactif vous attire ?",
    options: [
      { label: "Oud & Cuir", value: "wood" },
      { label: "Agrumes & Bergamote", value: "citrus" },
      { label: "Vanille & Ambre", value: "sweet" },
      { label: "Rose & Jasmin", value: "floral" }
    ]
  }
];

export default function PerfumeFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  
  const router = useRouter();

  const handleSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for dramatic effect
    setTimeout(() => {
      const isMen = finalAnswers.gender === 'men';
      const catalog = isMen ? MEN_PRODUCTS : WOMEN_PRODUCTS;
      
      let match = catalog[0];
      
      if (finalAnswers.note === 'wood') {
        match = catalog.find(p => p.baseNotes.some(n => n.toLowerCase().includes('oud') || n.toLowerCase().includes('wood'))) || catalog[0];
      } else if (finalAnswers.note === 'citrus') {
        match = catalog.find(p => p.topNotes.some(n => n.toLowerCase().includes('citrus') || n.toLowerCase().includes('bergamot'))) || catalog[0];
      } else if (finalAnswers.note === 'sweet') {
        match = catalog.find(p => p.baseNotes.some(n => n.toLowerCase().includes('vanilla') || n.toLowerCase().includes('amber'))) || catalog[0];
      } else if (finalAnswers.note === 'floral') {
        match = catalog.find(p => p.heartNotes.some(n => n.toLowerCase().includes('rose') || n.toLowerCase().includes('jasmine'))) || catalog[0];
      }
      
      setRecommendation(match);
      setIsCalculating(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6 md:px-10 relative overflow-hidden pt-24 pb-16">
      <div className="max-w-4xl w-full relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Quiz Questions */}
          {!isCalculating && !recommendation && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-gold)] mb-6">
                Étape {currentStep + 1} sur {QUESTIONS.length}
              </span>
              
              <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.04em] text-[var(--color-text)] mb-12">
                {QUESTIONS[currentStep].question}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
                {QUESTIONS[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(QUESTIONS[currentStep].id, option.value)}
                    className={`p-6 border transition-all duration-300 ${
                      answers[QUESTIONS[currentStep].id] === option.value
                        ? 'border-[var(--color-gold)] bg-[var(--color-gold-muted)]'
                        : 'border-[var(--color-border-subtle)] hover:border-[var(--color-gold-muted)] bg-transparent'
                    }`}
                  >
                    <span className="text-[var(--color-text)] font-[family-name:var(--font-sans)] text-[0.7rem] uppercase tracking-[0.25em]">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Calculating State */}
          {isCalculating && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 border-t-[1px] border-b-[1px] border-[var(--color-gold)] rounded-full animate-spin mb-8" />
              <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.04em] text-[var(--color-gold)] animate-pulse">
                Analyse de votre profil...
              </h2>
              <p className="text-[var(--color-text-subtle)] font-[family-name:var(--font-sans)] mt-4 uppercase tracking-[0.25em] text-[0.65rem]">
                Création de votre parfum signature
              </p>
            </motion.div>
          )}

          {/* Result */}
          {recommendation && !isCalculating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 md:p-12 rounded-none"
            >
              <div className="relative w-full md:w-1/2 aspect-[3/4] bg-[var(--color-bg-elevated)] overflow-hidden">
                <Image 
                  src={recommendation.image} 
                  alt={recommendation.name} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent opacity-80" />
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                <span className="text-[var(--color-gold)] text-[0.65rem] tracking-[0.3em] uppercase mb-4 block">
                  Votre Parfum Signature
                </span>
                
                <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)] mb-4 font-light">
                  {recommendation.name}
                </h2>
                
                <p className="body-large mb-8 text-[var(--color-text)]">
                  D'après vos préférences, nous avons sélectionné ce chef-d'œuvre {recommendation.fragranceFamily}. {recommendation.description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <Link href={`/product/${recommendation.id}`}>
                    <MagneticButton className="px-8 py-3 bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] text-[0.7rem] uppercase tracking-[0.3em] hover:bg-[var(--color-cta-hover)] transition-colors duration-500 rounded-none border-none">
                      Découvrir ce Parfum
                    </MagneticButton>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setRecommendation(null);
                      setCurrentStep(0);
                      setAnswers({});
                    }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-[0.65rem] uppercase tracking-[0.25em] transition-colors py-3 px-4"
                  >
                    Recommencer
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
