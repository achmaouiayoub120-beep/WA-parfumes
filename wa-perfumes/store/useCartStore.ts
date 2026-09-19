import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products/men';

export type CartItem = Product & { 
  quantity: number; 
  selectedVolume: string; 
  selectedPrice: number; 
};

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, volume: string, price: number) => void;
  removeItem: (productId: string, volume: string) => void;
  updateQuantity: (productId: string, volume: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, volume, price) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id && item.selectedVolume === volume);
        
        if (existingItem) {
          set({
            items: currentItems.map(item => 
              item.id === product.id && item.selectedVolume === volume
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1, selectedVolume: volume, selectedPrice: price }] });
        }
      },
      
      removeItem: (productId, volume) => {
        set({
          items: get().items.filter(item => !(item.id === productId && item.selectedVolume === volume))
        });
      },
      
      updateQuantity: (productId, volume, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item => 
            item.id === productId && item.selectedVolume === volume
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.selectedPrice * item.quantity), 0);
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'wa-perfumes-cart',
    }
  )
);
