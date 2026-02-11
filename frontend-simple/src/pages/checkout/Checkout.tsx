import { FC, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '../../hooks/useCart';
import { ordersApi } from '../../api/orders';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { CartSummary } from '../../components/cart/CartSummary';
import { TEXTS, PAYMENT_METHODS } from '../../utils/constants';
import type { CreateOrderRequest, OrderType, PaymentMethod } from '../../api/types';

export const Checkout: FC = () => {
  const navigate = useNavigate();
  const { items, restaurantId, clearCart, subtotal } = useCart();
  
  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [deliveryAddress, setDeliveryAddress] = useState({
    address_line1: '',
    city: 'Алматы',
    state: 'Алматинская область',
    postal_code: '',
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => ordersApi.create(orderData),
    onSuccess: (order) => {
      clearCart();
      navigate(`/orders/${order.id}`);
    },
    onError: (error: any) => {
      alert('Ошибка при создании заказа: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (orderType === 'DELIVERY') {
      if (!deliveryAddress.address_line1) {
        newErrors.address = TEXTS.required;
      }
      if (!deliveryAddress.postal_code) {
        newErrors.postal_code = TEXTS.required;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (!restaurantId) return;

    const orderData: CreateOrderRequest = {
      restaurant: restaurantId,
      order_type: orderType,
      items: items.map((item) => ({
        menu_item: item.menuItem.id,
        quantity: item.quantity,
        modifiers: item.modifiers,
        special_instructions: item.specialInstructions,
      })),
      payment_method: paymentMethod,
    };

    if (orderType === 'DELIVERY') {
      orderData.delivery_address = deliveryAddress;
      orderData.delivery_instructions = deliveryInstructions;
    }

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{TEXTS.checkout}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Тип заказа</h2>
              <div className="space-y-2">
                {(['DELIVERY', 'TAKEOUT'] as OrderType[]).map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="orderType"
                      value={type}
                      checked={orderType === type}
                      onChange={(e) => setOrderType(e.target.value as OrderType)}
                      className="w-4 h-4 text-primary-500"
                    />
                    <span>{TEXTS[type as keyof typeof TEXTS]}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Delivery Address */}
            {orderType === 'DELIVERY' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Адрес доставки</h2>
                <div className="space-y-4">
                  <Input
                    label="Адрес"
                    value={deliveryAddress.address_line1}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address_line1: e.target.value })}
                    error={errors.address}
                    required
                  />
                  <Input
                    label="Город"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    required
                  />
                  <Input
                    label="Почтовый индекс"
                    value={deliveryAddress.postal_code}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postal_code: e.target.value })}
                    error={errors.postal_code}
                    required
                  />
                  <Input
                    label="Примечания для курьера"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Например: позвоните за 5 минут"
                  />
                </div>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Способ оплаты</h2>
              <div className="space-y-2">
                {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-4 h-4 text-primary-500"
                    />
                    <span>{PAYMENT_METHODS[method]}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary 
                subtotal={subtotal}
                deliveryFee={orderType === 'DELIVERY' ? 300 : 0}
                tax={0}
              />
              <Button
                type="submit"
                fullWidth
                className="mt-4"
                isLoading={createOrderMutation.isPending}
              >
                {TEXTS.placeOrder}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
