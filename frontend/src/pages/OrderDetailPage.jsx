import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

  const getStatusProgress = (status) => {
    const steps = {
      PENDING: 0,
      CONFIRMED: 25,
      PREPARING: 50,
      OUT_FOR_DELIVERY: 75,
      DELIVERED: 100,
      CANCELLED: 0,
    };
    return steps[status] || 0;
  };

  const isStepCompleted = (currentStatus, requiredStatuses) => {
    return requiredStatuses.includes(currentStatus);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(true);
    try {
      await dispatch(cancelOrder(id));
      toast.success('Order cancelled successfully');
      dispatch(fetchOrderById(id));
    } catch (error) {
      toast.error('Failed to cancel order');
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
      toast.error(error.message);
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
  const progress = getStatusProgress(order.status);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="text-orange-600 hover:text-orange-700 mb-4"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            {order.status !== 'CANCELLED' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">📍 Order Tracking</h2>
                
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  <div className={`flex items-start ${isStepCompleted(order.status, ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? 'text-orange-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isStepCompleted(order.status, ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                      ✓
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Order Placed</div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-start ${isStepCompleted(order.status, ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? 'text-orange-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isStepCompleted(order.status, ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                      {isStepCompleted(order.status, ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? '✓' : '○'}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Order Confirmed</div>
                      <div className="text-sm text-gray-600">Restaurant accepted your order</div>
                    </div>
                  </div>

                  <div className={`flex items-start ${isStepCompleted(order.status, ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? 'text-orange-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isStepCompleted(order.status, ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                      {isStepCompleted(order.status, ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']) ? '✓' : '○'}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Preparing Food</div>
                      <div className="text-sm text-gray-600">Your food is being prepared</div>
                    </div>
                  </div>

                  <div className={`flex items-start ${isStepCompleted(order.status, ['OUT_FOR_DELIVERY', 'DELIVERED']) ? 'text-orange-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isStepCompleted(order.status, ['OUT_FOR_DELIVERY', 'DELIVERED']) ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                      {isStepCompleted(order.status, ['OUT_FOR_DELIVERY', 'DELIVERED']) ? '✓' : '○'}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Out for Delivery</div>
                      <div className="text-sm text-gray-600">Driver is on the way</div>
                    </div>
                  </div>

                  <div className={`flex items-start ${isStepCompleted(order.status, ['DELIVERED']) ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isStepCompleted(order.status, ['DELIVERED']) ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                      {isStepCompleted(order.status, ['DELIVERED']) ? '✓' : '○'}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Delivered</div>
                      <div className="text-sm text-gray-600">
                        {order.status === 'DELIVERED' ? 'Enjoy your meal!' : 'Estimated delivery time'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🍽️ Order Items</h2>
              
              <div className="mb-4 pb-4 border-b">
                <div className="font-semibold text-gray-900">
                  From: {order.restaurant?.name || 'Restaurant'}
                </div>
              </div>

              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x</span>{' '}
                      <span className="text-gray-700">{item.menu_item_name || 'Item'}</span>
                    </div>
                    <span className="font-semibold">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">📍 Delivery Information</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-600">Address</div>
                  <div className="text-gray-900">{order.delivery_address}</div>
                </div>
                
                {order.delivery_instructions && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Instructions</div>
                    <div className="text-gray-900">{order.delivery_instructions}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-gray-600">Payment Method</div>
                  <div className="text-gray-900">
                    {order.payment_method === 'CARD' && '💳 Credit/Debit Card'}
                    {order.payment_method === 'CASH' && '💵 Cash on Delivery'}
                    {order.payment_method === 'WALLET' && '👛 Digital Wallet'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Status Badge */}
              <div className="mb-6 text-center">
                {order.status === 'PENDING' && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    ⏳ Pending
                  </span>
                )}
                {order.status === 'CONFIRMED' && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ✓ Confirmed
                  </span>
                )}
                {order.status === 'PREPARING' && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    👨‍🍳 Preparing
                  </span>
                )}
                {order.status === 'OUT_FOR_DELIVERY' && (
                  <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    🚚 Out for Delivery
                  </span>
                )}
                {order.status === 'DELIVERED' && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✅ Delivered
                  </span>
                )}
                {order.status === 'CANCELLED' && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    ❌ Cancelled
                  </span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pb-4 border-b mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${parseFloat(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>${parseFloat(order.delivery_fee || 0).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${parseFloat(order.discount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-orange-600">
                  ${parseFloat(order.total_price || 0).toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleReorder}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  🔄 Reorder
                </button>

                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400"
                  >
                    {cancelling ? 'Cancelling...' : '❌ Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
