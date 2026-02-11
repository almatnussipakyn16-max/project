import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '../api/types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifiers?: string[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: number | null;
  addItem: (item: MenuItem, restaurantId: number, modifiers?: string[], specialInstructions?: string) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (menuItem, restaurantId, modifiers, specialInstructions) => {
        const state = get();
        
        // Если это другой ресторан, очищаем корзину
        if (state.restaurantId && state.restaurantId !== restaurantId) {
          if (!confirm('Добавление блюда из другого ресторана очистит корзину. Продолжить?')) {
            return;
          }
          set({ items: [], restaurantId });
        }

        const existing = state.items.find(i => i.menuItem.id === menuItem.id);
        
        if (existing) {
          set({
            items: state.items.map(i =>
              i.menuItem.id === menuItem.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...state.items, { menuItem, quantity: 1, modifiers, specialInstructions }],
            restaurantId,
          });
        }
      },

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(i => i.menuItem.id !== itemId),
        restaurantId: state.items.length === 1 ? null : state.restaurantId,
      })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.menuItem.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], restaurantId: null }),

      getItemCount: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().getSubtotal();
      },

      getSubtotal: () => {
        const items = get().items;
        return items.reduce((sum, item) => 
          sum + parseFloat(item.menuItem.price) * item.quantity, 0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
