import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import OrderTimeline from '../components/orders/OrderTimeline';
import PageTransition from '../components/common/PageTransition';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiRefreshCw, FiXCircle, FiDollarSign } from 'react-icons/fi';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: order, loading } = useSelector((state) => state.orders);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    
    // Auto-refresh every 30 seconds for live tracking
    const interval = setInterval(() => {
      dispatch(fetchOrderById(id));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [id, dispatch]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(true);
    try {
      await dispatch(cancelOrder(id)).unwrap();
      toast.success('Order cancelled successfully');
      dispatch(fetchOrderById(id));
    } catch (error) {
      const errorMessage = error?.message || 'Failed to cancel order';
      toast.error(errorMessage);
      console.error('Order cancellation error:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = () => {
    if (!order || !order.items) return;
    
    try {
      order.items.forEach((item) => {
        dispatch(addToCart({
          id: item.menu_item,
          name: item.menu_item_name,
          price: item.price,
          restaurant: order.restaurant,
        }));
      });
      toast.success('Items added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add items to cart');
    }
  };

  if (loading && !order) return <LoadingSpinner fullScreen />;
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
      </div>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 font-semibold transition"
          >
            <FiArrowLeft /> Back to Orders
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-bold text-gray-900">Order #{order.id}</h1>
            <StatusBadge status={order.status} size="lg" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">📍</span>
                Order Tracking
              </h2>
              <OrderTimeline order={order} />
            </motion.div>

            {/* Restaurant & Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🍽️</span>
                Order Items
              </h2>
              
              <div className="mb-6 pb-4 border-b">
                <div className="text-lg font-semibold text-gray-900">
                  From: {order.restaurant?.name || 'Restaurant'}
                </div>
                {order.restaurant?.address && (
                  <div className="text-gray-600 text-sm mt-1">
                    {order.restaurant.address}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-lg">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.menu_item_name || 'Item'}</div>
                        <div className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)} each</div>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiMapPin className="text-orange-600" />
                Delivery Information
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-1">Address</div>
                  <div className="text-gray-900 font-semibold">{order.delivery_address}</div>
                </div>
                
                {order.delivery_instructions && (
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="text-sm font-medium text-blue-700 mb-1">Special Instructions</div>
                    <div className="text-blue-900">{order.delivery_instructions}</div>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-1">Payment Method</div>
                  <div className="text-gray-900 font-semibold flex items-center gap-2">
                    <FiCreditCard />
                    {order.payment_method === 'CARD' && 'Credit/Debit Card'}
                    {order.payment_method === 'CASH' && 'Cash on Delivery'}
                    {order.payment_method === 'WALLET' && 'Digital Wallet'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-4 border-b mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">${parseFloat(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">${parseFloat(order.delivery_fee || 0).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-${parseFloat(order.discount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  ${parseFloat(order.total_price || 0).toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleReorder}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <FiRefreshCw />
                  Reorder
                </button>

                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <FiXCircle />
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default OrderDetailPage;
