'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShoppingBag } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';

const VILLES_MAROC = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Agadir',
  'Fès',
  'Meknès',
  'Oujda',
  'Tétouan',
  'El Jadida',
  'Kenitra',
  'Autre',
];

export default function WhatsAppDrawer() {
  const isOpen = useUIStore((s) => s.isWhatsAppOpen);
  const closeWhatsApp = useUIStore((s) => s.closeWhatsApp);
  const whatsappContext = useUIStore((s) => s.whatsappContext);
  const items = useCartStore((s) => s.items);
  const getCartTotal = useCartStore((s) => s.getCartTotal);
  const [mounted, setMounted] = useState(false);

  const [nom, setNom] = useState('');
  const [phone, setPhone] = useState('');
  const [ville, setVille] = useState('Casablanca');
  const [autreVille, setAutreVille] = useState('');
  const [quantite, setQuantite] = useState(1);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212707525317';
    const villeFinale = ville === 'Autre' ? autreVille : ville;

    let itemsList: string;
    let totalEstime: string;

    if (whatsappContext) {
      itemsList = whatsappContext.itemsText;
      totalEstime = whatsappContext.totalText;
    } else if (items.length > 0) {
      itemsList = items
        .map((item) => `• ${item.quantity}x ${item.name} — (${item.price * item.quantity} DH)`)
        .join('\n');
      totalEstime = `${getCartTotal()} DH`;
    } else {
      // If cart is empty, use the generic quantity
      itemsList = `• ${quantite}x Parfum(s) sélectionné(s)`;
      totalEstime = 'À confirmer';
    }

    const message = `❖ NOUVELLE COMMANDE — WA PERFUMES ❖
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ Détail de la Sélection :
${itemsList}

✦ Total estimé : ${totalEstime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ Informations Client :
• Nom complet : ${nom}
• Téléphone : ${phone}
• Ville : ${villeFinale}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dans l'attente de votre confirmation concernant la disponibilité et le délai de livraison.`;

    window.open(
      `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
    closeWhatsApp();
  };

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
            className="fixed inset-0 z-[150] backdrop-blur-sm"
            style={{ backgroundColor: 'var(--color-bg-overlay)' }}
            onClick={closeWhatsApp}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
            className="fixed top-0 right-0 bottom-0 z-[151] w-full max-w-md flex flex-col"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderLeft: '1px solid var(--color-gold-border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: '1px solid var(--color-border-faint)' }}
            >
              <div className="flex items-center gap-3">
                {/* WhatsApp Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h2
                    className="font-[family-name:var(--font-cormorant)] text-lg tracking-[0.06em]"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Smart WhatsApp
                  </h2>
                  <p
                    className="text-[0.6rem] tracking-[0.15em]"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    Votre sélection est confirmée !
                  </p>
                </div>
              </div>
              <button
                onClick={closeWhatsApp}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors duration-300"
                style={{ color: 'var(--color-text-subtle)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-subtle)')}
                aria-label="Fermer le formulaire WhatsApp"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Summary */}
              {whatsappContext?.type === 'pack' && (
                <div
                  className="mb-6 p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-faint)',
                  }}
                >
                  <p
                    className="text-[0.55rem] uppercase tracking-[0.3em] mb-3"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    Votre sélection
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-gold-border)' }}>
                      <Image
                        src="/placeholder.png"
                        alt="Pack Découverte"
                        fill
                        className="object-cover opacity-80 mix-blend-screen"
                      />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-cormorant)] text-base text-[var(--color-gold)] mb-1">
                        Coffret Découverte
                      </p>
                      <p className="text-[0.6rem] text-[var(--color-text-subtle)] leading-relaxed">
                        5 Parfums WA Signature & Elegance (30ml)
                      </p>
                    </div>
                  </div>
                  <div
                    className="mt-4 pt-3 flex justify-between items-center"
                    style={{ borderTop: '1px solid var(--color-border-faint)' }}
                  >
                    <span
                      className="text-[0.6rem] uppercase tracking-[0.2em]"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Total estimé
                    </span>
                    <span
                      className="font-[family-name:var(--font-cormorant)] text-base"
                      style={{ color: 'var(--color-gold)' }}
                    >
                      {whatsappContext.totalText}
                    </span>
                  </div>
                </div>
              )}

              {/* Cart Summary (if items exist and no pack context) */}
              {!whatsappContext && items.length > 0 && (
                <div
                  className="mb-6 p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-faint)',
                  }}
                >
                  <p
                    className="text-[0.55rem] uppercase tracking-[0.3em] mb-3"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    Votre sélection
                  </p>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-12 shrink-0 overflow-hidden rounded-sm" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs truncate"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="text-[0.6rem]"
                            style={{ color: 'var(--color-text-subtle)' }}
                          >
                            Qté: {item.quantity}
                          </p>
                        </div>
                        <span
                          className="text-xs whitespace-nowrap font-[family-name:var(--font-sans)]"
                          style={{ color: 'var(--color-gold)' }}
                        >
                          {item.price * item.quantity} DH
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-3 pt-3 flex justify-between items-center"
                    style={{ borderTop: '1px solid var(--color-border-faint)' }}
                  >
                    <span
                      className="text-[0.6rem] uppercase tracking-[0.2em]"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Total estimé
                    </span>
                    <span
                      className="font-[family-name:var(--font-cormorant)] text-base"
                      style={{ color: 'var(--color-gold)' }}
                    >
                      {getCartTotal()} DH
                    </span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form id="whatsapp-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Nom Complet */}
                <div>
                  <label
                    htmlFor="wa-nom"
                    className="text-[0.6rem] uppercase tracking-[0.25em] font-medium block mb-1.5"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Nom Complet
                  </label>
                  <input
                    id="wa-nom"
                    type="text"
                    required
                    placeholder="ex: Ayoub Benali"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full p-3.5 min-h-[44px] rounded-none text-sm transition-colors duration-300 outline-none"
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1px solid var(--color-input-border)',
                      color: 'var(--color-text)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-focus)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-border)')}
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label
                    htmlFor="wa-phone"
                    className="text-[0.6rem] uppercase tracking-[0.25em] font-medium block mb-1.5"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Téléphone
                  </label>
                  <input
                    id="wa-phone"
                    type="tel"
                    required
                    placeholder="06 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3.5 min-h-[44px] rounded-none text-sm transition-colors duration-300 outline-none"
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1px solid var(--color-input-border)',
                      color: 'var(--color-text)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-focus)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-border)')}
                  />
                </div>

                {/* Ville de Livraison */}
                <div>
                  <label
                    htmlFor="wa-ville"
                    className="text-[0.6rem] uppercase tracking-[0.25em] font-medium block mb-1.5"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Ville de Livraison
                  </label>
                  <select
                    id="wa-ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full p-3.5 min-h-[44px] rounded-none text-sm transition-colors duration-300 outline-none appearance-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1px solid var(--color-input-border)',
                      color: 'var(--color-text)',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A9590' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-focus)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-border)')}
                  >
                    {VILLES_MAROC.map((v) => (
                      <option key={v} value={v}>
                        {v === 'Autre' ? 'Autre ville...' : v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Autre Ville (conditional) */}
                <AnimatePresence>
                  {ville === 'Autre' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <label
                        htmlFor="wa-autre-ville"
                        className="text-[0.6rem] uppercase tracking-[0.25em] font-medium block mb-1.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Précisez votre ville
                      </label>
                      <input
                        id="wa-autre-ville"
                        type="text"
                        required
                        placeholder="Nom de votre ville"
                        value={autreVille}
                        onChange={(e) => setAutreVille(e.target.value)}
                        className="w-full p-3.5 min-h-[44px] rounded-none text-sm transition-colors duration-300 outline-none"
                        style={{
                          backgroundColor: 'var(--color-input-bg)',
                          border: '1px solid var(--color-input-border)',
                          color: 'var(--color-text)',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-focus)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-input-border)')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quantité (when cart is empty and no context) */}
                {items.length === 0 && !whatsappContext && (
                  <div>
                    <label
                      htmlFor="wa-quantite"
                      className="text-[0.6rem] uppercase tracking-[0.25em] font-medium block mb-1.5"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Quantité
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantite(Math.max(1, quantite - 1))}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm transition-colors duration-300"
                        style={{
                          backgroundColor: 'var(--color-input-bg)',
                          border: '1px solid var(--color-input-border)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        −
                      </button>
                      <span
                        className="w-10 text-center font-[family-name:var(--font-sans)] text-sm tabular-nums"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {quantite}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantite(quantite + 1)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm transition-colors duration-300"
                        style={{
                          backgroundColor: 'var(--color-input-bg)',
                          border: '1px solid var(--color-input-border)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer CTA */}
            <div
              className="shrink-0 px-6 py-5"
              style={{ borderTop: '1px solid var(--color-border-faint)' }}
            >
              <button
                type="submit"
                form="whatsapp-form"
                className="w-full py-4 min-h-[52px] flex items-center justify-center gap-2.5 text-[0.7rem] uppercase tracking-[0.25em] font-medium text-white rounded-none transition-all duration-300"
                style={{
                  backgroundColor: '#25D366',
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#22c55e';
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.25)';
                }}
              >
                <Send className="w-4 h-4" />
                Commander via WhatsApp
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <span
                  className="text-[0.5rem] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  ✦ Livraison partout au Maroc
                </span>
                <span
                  className="text-[0.5rem] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  ✦ Paiement à la livraison
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
