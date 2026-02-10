import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    delivery_address: user?.address || '',
    delivery_instructions: '',
    payment_method: 'CARD',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    const orderData = {
      restaurant: restaurant.id,
      items: items.map((item) => ({
        menu_item: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      delivery_address: formData.delivery_address,
      delivery_instructions: formData.delivery_instructions,
      payment_method: formData.payment_method,
    };

    try {
      const result = await dispatch(createOrder(orderData));
      
      if (!result.error) {
        dispatch(clearCart());
        const orderId = result.payload.id;
        alert('✅ Order placed successfully!');
        navigate(`/orders/${orderId}`);
      } else {
        alert('❌ Failed to place order: ' + (result.error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('❌ Failed to place order');
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">📦 Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">📍 Delivery Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      required
                      placeholder="123 Main St, City, State, ZIP"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1 234 567 890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="delivery_instructions"
                      value={formData.delivery_instructions}
                      onChange={handleChange}
                      rows="3"
                      placeholder="e.g., Ring the doorbell, Leave at door..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">💳 Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                    <input
                      type="radio"
                      name="payment_method"
                      value="CARD"
                      checked={formData.payment_method === 'CARD'}
                      onChange={handleChange}
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">💳 Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Pay securely with your card</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                    <input
                      type="radio"
                      name="payment_method"
                      value="CASH"
                      checked={formData.payment_method === 'CASH'}
                      onChange={handleChange}
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">💵 Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                    <input
                      type="radio"
                      name="payment_method"
                      value="WALLET"
                      checked={formData.payment_method === 'WALLET'}
                      onChange={handleChange}
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">👛 Digital Wallet</div>
                      <div className="text-sm text-gray-600">Apple Pay, Google Pay, etc.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Restaurant */}
                <div className="mb-4 pb-4 border-b">
                  <div className="font-semibold text-gray-900">🍽️ {restaurant.name}</div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : '🚀 Place Order'}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {loading && <LoadingSpinner fullScreen />}
    </div>
  );
};

export default CheckoutPage;
