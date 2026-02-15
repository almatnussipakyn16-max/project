import { useCartStore } from '../store/cart';

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // ✅ Вычисляем общее количество товаров с защитой
  const totalItems = items.reduce((sum, item) => {
    return sum + (item?.quantity || 0);
  }, 0);
  
  // ✅ Вычисляем общую стоимость с полной защитой
  const totalPrice = items.reduce((total, item) => {
    // Проверяем что все данные существуют
    if (!item || !item.menuItem || item.menuItem.price == null) {
      console.warn('Invalid cart item:', item);
      return total;
    }
    
    const price = typeof item.menuItem.price === 'number'
      ? item.menuItem.price
      : parseFloat(String(item.menuItem.price));
    
    const quantity = item.quantity || 0;
    
    return total + (price * quantity);
  }, 0);

  const restaurantId = items.length > 0 && items[0] ? items[0].restaurantId : null;
  const restaurantName = items.length > 0 && items[0] ? items[0].restaurantName : null;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    restaurantId,
    restaurantName,
  };
};