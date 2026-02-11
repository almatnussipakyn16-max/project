import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { TEXTS } from '../../utils/constants';

export const Cart: FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">{TEXTS.emptyCart}</h2>
          <p className="text-gray-600 mb-8">
            Добавьте блюда из ресторанов, чтобы начать заказ
          </p>
          <Link to="/restaurants">
            <Button>Перейти к ресторанам</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{TEXTS.cart}</h1>
        <Button variant="danger" onClick={clearCart}>
          Очистить корзину
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {items.map((item) => (
              <CartItem
                key={item.menuItem.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="font-semibold mb-4">{TEXTS.promoCode}</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Введите промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button>{TEXTS.apply}</Button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CartSummary 
              subtotal={subtotal}
              deliveryFee={300}
              tax={0}
            />
            <Button 
              fullWidth 
              className="mt-4"
              onClick={handleCheckout}
            >
              {TEXTS.checkout}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;