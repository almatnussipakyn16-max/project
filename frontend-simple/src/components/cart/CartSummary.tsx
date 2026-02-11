import { FC } from 'react';
import { Card } from '../common/Card';
import { formatPrice } from '../../utils/formatters';
import { TEXTS } from '../../utils/constants';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  discount?: number;
}

export const CartSummary: FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee = 0,
  tax = 0,
  discount = 0,
}) => {
  const total = subtotal + deliveryFee + tax - discount;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Итого</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>{TEXTS.subtotal}:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>{TEXTS.delivery}:</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>{TEXTS.tax}:</span>
            <span>{formatPrice(tax)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{TEXTS.discount}:</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>{TEXTS.total}:</span>
            <span className="text-primary-500">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
