import { create } from 'zustand';

export interface WhatsAppOrderContext {
  type: 'cart' | 'pack' | 'standard';
  itemsText: string;
  totalText: string;
}

interface UIStore {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  isWhatsAppOpen: boolean;
  whatsappContext: WhatsAppOrderContext | null;
  openWhatsApp: (context?: WhatsAppOrderContext) => void;
  closeWhatsApp: () => void;
  toggleWhatsApp: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  isWhatsAppOpen: false,
  whatsappContext: null,
  openWhatsApp: (context) => set({ isWhatsAppOpen: true, whatsappContext: context || null }),
  closeWhatsApp: () => set({ isWhatsAppOpen: false }),
  toggleWhatsApp: () => set((state) => ({ isWhatsAppOpen: !state.isWhatsAppOpen })),
}));
