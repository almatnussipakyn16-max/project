import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '../types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: number;
  restaurantName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem, restaurantId: number, restaurantName: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getRestaurantId: () => number | null;
  getRestaurantName: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, restaurantId, restaurantName) => {
        const currentItems = get().items;
        
        if (currentItems.length > 0 && currentItems[0].restaurantId !== restaurantId) {
          const confirmClear = window.confirm(
            `В корзине есть товары из "${currentItems[0].restaurantName}". Очистить корзину и добавить товар из "${restaurantName}"?`
          );
          if (!confirmClear) return;
          set({ items: [] });
        }

        const existingItem = get().items.find(
          (item) => item.menuItem?.id === menuItem.id
        );

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.menuItem?.id === menuItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { 
                menuItem, 
                quantity: 1,
                restaurantId,
                restaurantName,
              },
            ],
          });
        }
      },

      removeItem: (menuItemId) => {
        set({
          items: get().items.filter((item) => item.menuItem?.id !== menuItemId),
        });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.menuItem?.id === menuItemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          if (!item || !item.menuItem || item.menuItem.price == null) {
            return total;
          }
          
          const price = typeof item.menuItem.price === 'number'
            ? item.menuItem.price
            : parseFloat(item.menuItem.price || '0');
          return total + price * item.quantity;
        }, 0);
      },

      getRestaurantId: () => {
        const items = get().items;
        return items.length > 0 && items[0] ? items[0].restaurantId : null;
      },

      getRestaurantName: () => {
        const items = get().items;
        return items.length > 0 && items[0] ? items[0].restaurantName : null;
      },
    }),
    {
      name: 'cart-storage',
      version: 1, // ✅ Версия для миграции
      
      // ✅ Миграция старых данных
      migrate: (persistedState: any, version: number) => {
        const state = persistedState as any;
        
        // Если нет items или пустой массив - вернуть как есть
        if (!state?.items || !Array.isArray(state.items)) {
          return { items: [] };
        }

        // ✅ Проверяем и исправляем формат каждого элемента
        state.items = state.items
          .map((item: any) => {
            // Если это старый формат (прямо объект MenuItem без обёртки)
            if (item.id && item.name && !item.menuItem) {
              console.warn('Migrating old cart item format:', item);
              // Конвертируем в новый формат
              return {
                menuItem: item,
                quantity: item.quantity || 1,
                restaurantId: item.restaurantId || item.restaurant || 0,
                restaurantName: item.restaurantName || 'Unknown',
              };
            }
            
            // Если уже правильный формат - оставляем как есть
            if (item.menuItem && item.quantity) {
              return item;
            }
            
            // Битые данные - пропускаем
            console.warn('Removing invalid cart item:', item);
            return null;
          })
          .filter((item: any) => item !== null); // Убираем null

        return state;
      },
    }
  )
);