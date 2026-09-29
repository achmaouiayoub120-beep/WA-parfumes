'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[var(--color-border-faint)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group cursor-pointer focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-[0.7rem] uppercase tracking-[0.2em] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-4 h-4 flex items-center justify-center text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="6" y1="1" x2="6" y2="11" />
            <line x1="1" y1="6" x2="11" y2="6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm text-[var(--color-text-muted)] space-y-3 font-[family-name:var(--font-sans)] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductAccordions() {
  return (
    <div className="w-full border-b border-[var(--color-border-faint)]">
      <AccordionItem title="Ingrédients & Composition" defaultOpen={true}>
        <p>
          Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Citronellol, Geraniol, Citral, Benzyl Benzoate, Eugenol.
        </p>
        <p className="text-[0.75rem] text-[var(--color-text-subtle)] italic pt-1">
          Formulation testée dermatologiquement. Élaborée dans le respect des normes internationales de haute parfumerie (IFRA).
        </p>
      </AccordionItem>

      <AccordionItem title="Conseils d'Application">
        <ul className="list-disc list-inside space-y-1.5 marker:text-[var(--color-accent)]">
          <li>Vaporisez généreusement sur les points de pulsion : poignets, creux du cou et arrière des oreilles.</li>
          <li>Maintenez le flacon à une distance de 15 à 20 cm de la peau pour une diffusion homogène.</li>
          <li>Pour maximiser la tenue, appliquez sur une peau préalablement hydratée avec une crème inodore.</li>
          <li>Conservez votre parfum à l'abri de la lumière directe, de l'humidité et de la chaleur dans un endroit frais.</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Livraison & Retours">
        <div className="space-y-2">
          <p>
            <strong className="text-[var(--color-text)] font-medium">Livraison offerte</strong> sur l'ensemble du Maroc en 2 à 4 jours ouvrés.
          </p>
          <p>
            Chaque commande est préparée avec le plus grand soin et expédiée dans un <strong className="text-[var(--color-text)] font-medium">emballage discret</strong> et élégant avec échantillons de découverte offerts.
          </p>
          <p>
            Retours acceptés sous <strong className="text-[var(--color-text)] font-medium">14 jours</strong> à compter de la réception, à condition que le produit soit dans son état d'origine, non ouvert et scellé.
          </p>
        </div>
      </AccordionItem>
    </div>
  );
}

export const ProductAccordion = ProductAccordions;
export default ProductAccordions;
