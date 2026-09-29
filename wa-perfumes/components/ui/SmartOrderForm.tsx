'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';

interface SmartOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    currency?: string;
  };
}

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir',
  'Fès', 'Meknès', 'Oujda', 'Tétouan', 'El Jadida', 'Kenitra', 'Autre ville...'
];

export default function SmartOrderForm({ isOpen, onClose, product }: SmartOrderFormProps) {
  const [formData, setFormData] = useState({
    nomComplet: '',
    telephone: '',
    ville: CITIES[0],
    autreVille: '',
    adresse: '',
  });
  const [quantite, setQuantite] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nomComplet || !formData.telephone || !formData.adresse) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const villeFinale = formData.ville === 'Autre ville...' ? formData.autreVille : formData.ville;
    if (formData.ville === 'Autre ville...' && !formData.autreVille) {
      setError('Veuillez préciser votre ville.');
      return;
    }

    setIsSubmitting(true);

    const prixTotal = product.price * quantite;
    const cur = product.currency || 'DH';
    const orderPayload = {
      nomComplet: formData.nomComplet,
      telephone: formData.telephone,
      ville: villeFinale,
      adresse: formData.adresse,
      produit: product.name,
      quantite,
      prixUnitaire: product.price,
      prixTotal,
    };

    // POST to API (non-blocking)
    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.error('Erreur API Order:', err);
    }

    // Build WhatsApp message
    const lines = [
      'Nouvelle commande !',
      '',
      'Client: ' + formData.nomComplet,
      'Tel: ' + formData.telephone,
      'Ville: ' + villeFinale,
      'Adresse: ' + formData.adresse,
      '',
      'Produit: ' + product.name,
      'Quantite: ' + quantite,
      'Total: ' + prixTotal + ' ' + cur,
    ];
    const message = lines.join('\n');

    window.open('https://wa.me/212707525317?text=' + encodeURIComponent(message), '_blank');

    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-[#111] border border-white/10 md:rounded-xl rounded-t-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-cormorant text-[var(--color-gold)]">Finaliser la Commande</h2>
              <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-6 p-3 bg-red-950/50 border border-red-900/50 text-red-200 text-sm rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nom Complet */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">Nom Complet *</label>
                  <input
                    type="text"
                    name="nomComplet"
                    required
                    value={formData.nomComplet}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Telephone */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">{"Téléphone *"}</label>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    placeholder="06 XX XX XX XX"
                  />
                </div>

                {/* Ville */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">Ville *</label>
                  <div className="relative">
                    <select
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    >
                      {CITIES.map(city => (
                        <option key={city} value={city} className="bg-[#111] text-white">{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.ville === 'Autre ville...' && (
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">{"Précisez votre ville *"}</label>
                    <input
                      type="text"
                      name="autreVille"
                      required
                      value={formData.autreVille}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      placeholder="Nom de la ville"
                    />
                  </div>
                )}

                {/* Adresse */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">{"Adresse détaillée *"}</label>
                  <textarea
                    name="adresse"
                    required
                    rows={3}
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
                    placeholder="Quartier, rue, numéro..."
                  />
                </div>

                {/* Quantite stepper */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--color-text-subtle)] uppercase tracking-wider">{"Quantité"}</span>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantite(Math.max(1, quantite - 1))}
                      className="p-1 hover:text-[var(--color-gold)] transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-medium">{quantite}</span>
                    <button
                      type="button"
                      onClick={() => setQuantite(quantite + 1)}
                      className="p-1 hover:text-[var(--color-gold)] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 mt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)] text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {"Commander via WhatsApp — " + (product.price * quantite) + " " + (product.currency || "DH")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
