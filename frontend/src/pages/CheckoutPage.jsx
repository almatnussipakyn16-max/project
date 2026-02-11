import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';
import PageTransition from '../components/common/PageTransition';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import {
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, subtotal, tax, deliveryFee, discount, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    delivery_address: user?.address || '',
    delivery_instructions: '',
    payment_method: 'CARD',
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // Early return if no restaurant (safety check)
  if (!restaurant) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Delivery', icon: FiMapPin },
    { number: 2, title: 'Payment', icon: FiCreditCard },
    { number: 3, title: 'Review', icon: FiShoppingBag },
  ];

  const paymentMethods = [
    { value: 'CARD', label: 'Credit/Debit Card', icon: '💳', description: 'Pay securely with your card' },
    { value: 'CASH', label: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
    { value: 'WALLET', label: 'Digital Wallet', icon: '📱', description: 'Apple Pay, Google Pay, etc.' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!formData.delivery_address.trim()) {
        toast.error('Please enter your delivery address');
        return;
      }
      toast.success('Delivery information saved');
      setStep(2);
    } else if (step === 2) {
      toast.success('Payment method selected');
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
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
        setShowConfetti(true);
        setTimeout(() => {
          dispatch(clearCart());
          const orderId = result.payload.id;
          toast.success('🎉 Order placed successfully!');
          navigate(`/orders/${orderId}`);
        }, 1500); // Wait for confetti
      } else {
        toast.error('Failed to place order: ' + (result.error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      {showConfetti && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={200}
            width={1600}
          />
        </div>
      )}
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FiShoppingBag className="text-orange-600" />
          Checkout
        </h1>

        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: step >= s.number ? 1 : 0.9,
                      backgroundColor: step > s.number ? '#10b981' : step === s.number ? '#f97316' : '#e5e7eb',
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                      step >= s.number ? 'shadow-lg' : ''
                    }`}
                  >
                    {step > s.number ? (
                      <FiCheckCircle className="text-2xl" />
                    ) : (
                      <s.icon className="text-2xl" />
                    )}
                  </motion.div>
                  <div className={`text-sm font-semibold ${step >= s.number ? 'text-orange-600' : 'text-gray-400'}`}>
                    {s.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 bg-gray-200 mx-2 mb-6">
                    <motion.div
                      initial={false}
                      animate={{
                        width: step > s.number ? '100%' : '0%',
                        backgroundColor: '#10b981',
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Steps */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Delivery Address */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-md p-6 space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <FiMapPin className="text-orange-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold">Delivery Address</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Enter your complete delivery address..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        name="delivery_instructions"
                        value={formData.delivery_instructions}
                        onChange={handleChange}
                        rows="3"
                        placeholder="e.g., Ring the doorbell, Leave at door..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleContinue}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <FiArrowRight className="text-xl" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-md p-6 space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FiCreditCard className="text-green-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold">Payment Method</h2>
                    </div>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                            formData.payment_method === method.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-300 hover:border-orange-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value={method.value}
                            checked={formData.payment_method === method.value}
                            onChange={handleChange}
                            className="mr-4 w-5 h-5 text-orange-600 focus:ring-orange-500"
                          />
                          <div className="text-3xl mr-4">{method.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{method.label}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                      >
                        Back
                      </button>
                      <motion.button
                        type="button"
                        onClick={handleContinue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        Continue to Review
                        <FiArrowRight className="text-xl" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Review Warning */}
                    <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-4 flex items-start gap-3">
                      <FiAlertCircle className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Review Your Order</h3>
                        <p className="text-sm text-blue-800">
                          Please review your order details carefully before placing your order. Make sure all information is correct.
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiShoppingBag className="text-blue-600 text-xl" />
                        </div>
                        <h2 className="text-2xl font-bold">Order Summary</h2>
                      </div>

                      <div className="space-y-3 pb-4 border-b">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Restaurant:</span>
                          <span className="font-semibold">{restaurant.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Address:</span>
                          <span className="font-semibold text-right max-w-md">{formData.delivery_address}</span>
                        </div>
                        {formData.delivery_instructions && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Instructions:</span>
                            <span className="font-semibold text-right max-w-md">{formData.delivery_instructions}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-semibold">
                            {paymentMethods.find(m => m.value === formData.payment_method)?.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold mb-2">Items ({items.length})</h3>
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
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                      >
                        Back
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold text-lg shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Placing Order...
                          </>
                        ) : (
                          <>
                            🚀 Place Order
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Restaurant */}
                <div className="mb-4 pb-4 border-b">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    🍽️ {restaurant.name}
                  </div>
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

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4 pb-4 border-b text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </PageTransition>
  );
};

export default CheckoutPage;
