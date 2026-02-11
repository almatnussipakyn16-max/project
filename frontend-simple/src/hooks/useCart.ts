import { useCartStore } from '../store/cart';
import type { MenuItem } from '../api/types';

export const useCart = () => {
  const {
    items,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    getSubtotal,
  } = useCartStore();

  const addToCart = (
    menuItem: MenuItem,
    restaurantId: number,
    modifiers?: string[],
    specialInstructions?: string
  ) => {
    addItem(menuItem, restaurantId, modifiers, specialInstructions);
  };

  return {
    items,
    restaurantId,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: getItemCount(),
    totalPrice: getTotalPrice(),
    subtotal: getSubtotal(),
  };
};
