import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateQuantity, removeFromCart, clearCart, applyDiscount } from '../store/slices/cartSlice';
import { promotionService } from '../services';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiTag, FiArrowRight, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant, subtotal, tax, deliveryFee, discount, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Local promo codes for immediate validation
  const validCodes = {
    'SAVE10': 10,
    'SAVE20': 20,
    'FIRST50': 50,
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      setAppliedPromo('');
      toast.success('Cart cleared');
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    setPromoLoading(true);
    setPromoError('');
    
    try {
      // First check local promo codes
      if (validCodes[promoCode]) {
        const discountPercent = validCodes[promoCode];
        const discountAmount = (subtotal * discountPercent) / 100;
        dispatch(applyDiscount(discountAmount));
        setAppliedPromo(promoCode);
        toast.success(`Promo code applied! You saved $${discountAmount.toFixed(2)} (${discountPercent}% off)`);
        setPromoCode('');
      } else {
        // Try backend validation as fallback
        const result = await promotionService.validate(
          promoCode,
          subtotal,
          restaurant?.id
        );
        
        if (result.valid) {
          const discountAmount = result.discount_amount || 0;
          dispatch(applyDiscount(discountAmount));
          setAppliedPromo(promoCode);
          toast.success(`Promo code applied! You saved $${discountAmount.toFixed(2)}`);
          setPromoCode('');
        } else {
          setPromoError(result.message || 'Invalid promo code');
          toast.error('Invalid promo code');
        }
      }
    } catch (error) {
      console.error('Promo validation error:', error);
      setPromoError('Invalid promo code');
      toast.error('Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    dispatch(applyDiscount(0));
    setAppliedPromo('');
    toast.success('Promo code removed');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items to your cart to get started!
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold shadow-lg hover:shadow-xl"
            >
              Browse Restaurants
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiShoppingCart className="text-orange-600" />
            Shopping Cart
            <span className="text-lg font-normal text-gray-600">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
            >
              <FiTrash2 />
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Restaurant Info */}
            {restaurant && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-orange-900">
                  🍽️ Ordering from: <span className="font-bold">{restaurant.name}</span>
                </h3>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">🍽️</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description || 'Delicious food item'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white rounded-full hover:bg-gray-200 transition font-bold flex items-center justify-center shadow-sm"
                            >
                              <FiMinus />
                            </motion.button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition font-bold flex items-center justify-center shadow-sm"
                            >
                              <FiPlus />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${parseFloat(item.price).toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 transition self-start"
                        title="Remove item"
                      >
                        <FiTrash2 className="text-2xl" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiTag className="text-orange-500" />
                  Promo Code
                </label>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border-2 border-green-500 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2">
                      <FiTag className="text-green-600" />
                      <span className="font-semibold text-green-700">{appliedPromo}</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove promo code"
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={promoLoading}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                      >
                        {promoLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-500 text-sm mt-1">{promoError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Try: <span className="font-semibold">SAVE10</span>, <span className="font-semibold">SAVE20</span>, <span className="font-semibold">FIRST50</span>
                    </p>
                  </>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b">
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
              <div className="flex justify-between items-center mb-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <FiArrowRight className="text-xl" />
              </motion.button>

              {/* Free Delivery Notice */}
              {subtotal < 30 && (
                <p className="text-sm text-gray-600 mt-4 text-center flex items-center justify-center gap-2">
                  <FiTag className="text-orange-500" />
                  Add ${(30 - subtotal).toFixed(2)} more for FREE delivery!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
