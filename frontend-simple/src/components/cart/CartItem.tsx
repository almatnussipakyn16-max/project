import { FC } from 'react';
import type { CartItem as CartItemType } from '../../store/cart';
import { formatPrice } from '../../utils/formatters';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

export const CartItem: FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { menuItem, quantity } = item;
  const itemTotal = parseFloat(menuItem.price) * quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {menuItem.image && (
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}

      <div className="flex-1">
        <h4 className="font-semibold">{menuItem.name}</h4>
        <p className="text-sm text-gray-600">{formatPrice(menuItem.price)}</p>
        {item.specialInstructions && (
          <p className="text-xs text-gray-500 mt-1">
            Примечание: {item.specialInstructions}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quantity controls */}
        <div className="flex items-center gap-2 border rounded">
          <button
            onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-3">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        {/* Total */}
        <span className="font-semibold w-24 text-right">
          {formatPrice(itemTotal)}
        </span>

        {/* Remove button */}
        <button
          onClick={() => onRemove(menuItem.id)}
          className="text-red-500 hover:text-red-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
