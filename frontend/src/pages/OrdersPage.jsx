import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('all'); // all, active, completed, cancelled

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      CONFIRMED: { text: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: '✓' },
      PREPARING: { text: 'Preparing', color: 'bg-purple-100 text-purple-800', icon: '👨‍🍳' },
      OUT_FOR_DELIVERY: { text: 'Out for Delivery', color: 'bg-orange-100 text-orange-800', icon: '🚚' },
      DELIVERED: { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: '✅' },
      CANCELLED: { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' },
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status);
    if (filter === 'completed') return order.status === 'DELIVERED';
    if (filter === 'cancelled') return order.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">📦 My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'all'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'active'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active ({orders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'completed'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({orders.filter(o => o.status === 'DELIVERED').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'cancelled'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancelled ({orders.filter(o => o.status === 'CANCELLED').length})
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600">
                      🍽️ {order.restaurant?.name || 'Restaurant'}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items Preview */}
                <div className="mb-4">
                  <p className="text-gray-700">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    {order.items && order.items.length > 0 && (
                      <span className="text-gray-500">
                        {' • '}
                        {order.items.slice(0, 2).map(item => item.menu_item_name || 'Item').join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </span>
                    )}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    📅 {new Date(order.created_at).toLocaleDateString()} at{' '}
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${parseFloat(order.total_price || 0).toFixed(2)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start ordering from your favorite restaurants!' 
                : `You don't have any ${filter} orders.`}
            </p>
            {filter === 'all' && (
              <Link
                to="/restaurants"
                className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                Browse Restaurants
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
