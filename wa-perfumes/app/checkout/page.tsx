'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ShieldCheck, CreditCard } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { items, getCartTotal, clearCart } = useCartStore();

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 3000);
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center pt-24 text-center">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)] font-light mb-6">
          Your Cart is Empty
        </h1>
        <p className="body-large mb-8 text-[var(--color-text)]">Begin your journey to find your signature scent.</p>
        <Link href="/">
          <MagneticButton className="px-8 py-4 border border-[var(--color-border)] text-[0.7rem] uppercase tracking-[0.3em] text-[var(--color-gold)] hover:bg-[var(--color-gold-muted)] transition-colors duration-500 rounded-none">
            Return Home
          </MagneticButton>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-32 pb-24 px-6 md:px-12 flex justify-center">
      <div className="max-w-[1440px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column: Form / Success */}
        <div className="relative">
          <AnimatePresence mode="wait">
            
            {/* SUCCESS STATE */}
            {isSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full justify-center"
              >
                <div className="w-16 h-16 bg-[var(--color-gold-muted)] rounded-full flex items-center justify-center mb-8 border border-[var(--color-border)]">
                  <Check className="w-8 h-8 text-[var(--color-gold)]" />
                </div>
                <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light text-[var(--color-text)] mb-6">
                  Order Confirmed.
                </h1>
                <p className="body-large mb-8 text-[var(--color-text)]">
                  Thank you for your purchase. Your signature scents are being prepared with the utmost care by WA Perfumes.
                </p>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-gold)] mb-12">
                  Order #WA-{Math.floor(Math.random() * 1000000)}
                </p>
                
                <Link href="/">
                  <MagneticButton className="px-8 py-4 bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] text-[0.7rem] uppercase tracking-[0.3em] hover:bg-[var(--color-cta-hover)] transition-colors duration-500 border-none rounded-none">
                    Return to Boutique
                  </MagneticButton>
                </Link>
              </motion.div>
            )}

            {/* CHECKOUT FORM */}
            {!isSuccess && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-4 mb-12">
                  <span className={`text-[0.65rem] uppercase tracking-[0.25em] ${step >= 1 ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-subtle)]'}`}>1. Details</span>
                  <div className={`w-8 h-[1px] ${step >= 2 ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border-subtle)]'}`} />
                  <span className={`text-[0.65rem] uppercase tracking-[0.25em] ${step >= 2 ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-subtle)]'}`}>2. Shipping</span>
                  <div className={`w-8 h-[1px] ${step >= 3 ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border-subtle)]'}`} />
                  <span className={`text-[0.65rem] uppercase tracking-[0.25em] ${step >= 3 ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-subtle)]'}`}>3. Payment</span>
                </div>

                <form onSubmit={step === 3 ? handleComplete : (e) => { e.preventDefault(); setStep(step + 1); }} className="space-y-8">
                  
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.04em] text-[var(--color-text)]">Contact Information</h2>
                      <div className="space-y-4">
                        <input type="email" required placeholder="Email Address" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" required placeholder="First Name" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                          <input type="text" required placeholder="Last Name" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.04em] text-[var(--color-text)]">Shipping Address</h2>
                      <div className="space-y-4">
                        <input type="text" required placeholder="Address" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                        <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" required placeholder="City" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                          <input type="text" required placeholder="Postal Code" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.04em] text-[var(--color-text)]">Payment Method</h2>
                      <div className="p-6 border border-[var(--color-border)] bg-[var(--color-gold-muted)] rounded-none space-y-4">
                        <div className="flex items-center justify-between mb-4 text-[var(--color-text)]">
                          <span className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-[var(--color-gold)]" /> Credit Card</span>
                        </div>
                        <input type="text" required placeholder="Card Number" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors font-mono" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" required placeholder="MM/YY" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors font-mono" />
                          <input type="text" required placeholder="CVC" className="w-full bg-[var(--color-input-bg)] border border-[var(--color-input-border)] rounded-none p-4 text-[var(--color-text)] focus:border-[var(--color-input-focus)] focus:outline-none transition-colors font-mono" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-8 flex justify-between items-center">
                    {step > 1 ? (
                      <button 
                        type="button" 
                        onClick={() => setStep(step - 1)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)] uppercase tracking-[0.25em] text-[0.65rem] transition-colors"
                      >
                        Back
                      </button>
                    ) : <div />}
                    
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 py-4 bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] font-[family-name:var(--font-sans)] text-[0.7rem] tracking-[0.3em] uppercase hover:bg-[var(--color-cta-hover)] transition-colors flex items-center justify-center min-w-[200px]"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-t-2 border-b-2 border-[var(--color-bg)] rounded-full animate-spin" />
                      ) : (
                        step === 3 ? 'Place Order' : 'Continue'
                      )}
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary */}
        <div className="border-t lg:border-t-0 lg:border-l border-[var(--color-border-subtle)] pt-12 lg:pt-0 lg:pl-16">
          <div className="sticky top-32">
            <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.04em] text-[var(--color-text)] mb-8">Order Summary</h3>
            
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[var(--color-gold)]">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-none overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[var(--color-text)] font-[family-name:var(--font-cormorant)] text-lg truncate">{item.name}</h4>
                    <p className="text-[var(--color-text-muted)] text-[0.65rem] uppercase tracking-[0.25em]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-[var(--color-gold)] font-[family-name:var(--font-sans)] whitespace-nowrap text-sm">
                    {item.price * item.quantity} DH
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--color-border-subtle)] space-y-4">
              <div className="flex justify-between text-[var(--color-text-muted)] text-sm">
                <span>Subtotal</span>
                <span>{getCartTotal()} DH</span>
              </div>
              <div className="flex justify-between text-[var(--color-text-muted)] text-sm">
                <span>Shipping (WA Perfumes Courier)</span>
                <span className="text-[var(--color-gold)]">Complimentary</span>
              </div>
              <div className="flex justify-between text-[var(--color-text)] font-[family-name:var(--font-cormorant)] text-2xl pt-4 border-t border-[var(--color-border-subtle)]">
                <span>Total</span>
                <span className="text-[var(--color-gold)]">{getCartTotal()} DH</span>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-[var(--color-text-subtle)] text-xs pb-12 lg:pb-0">
                <ShieldCheck className="w-4 h-4 text-[var(--color-gold)]" /> Secure SSL Encrypted Checkout
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
