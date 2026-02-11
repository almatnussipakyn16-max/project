import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchOrders } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { FiPackage, FiClock, FiShoppingBag } from 'react-icons/fi';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filters = [
    { key: 'all', label: 'All Orders' },
    { key: 'active', label: 'Active', statuses: ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'] },
    { key: 'completed', label: 'Completed', statuses: ['DELIVERED'] },
    { key: 'cancelled', label: 'Cancelled', statuses: ['CANCELLED'] },
  ];

  const getFilteredOrders = (filterKey) => {
    const filterObj = filters.find(f => f.key === filterKey);
    if (filterKey === 'all') return orders;
    return orders.filter(order => filterObj.statuses.includes(order.status));
  };

  const filteredOrders = getFilteredOrders(filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-gray-900">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-3 rounded-2xl text-white">
              <FiShoppingBag className="text-3xl" />
            </div>
            My Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage your orders</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {filters.map((filterItem) => {
            const count = getFilteredOrders(filterItem.key).length;
            return (
              <button
                key={filterItem.key}
                onClick={() => setFilter(filterItem.key)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  filter === filterItem.key
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow'
                }`}
              >
                {filterItem.label} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="text-2xl">🍽️</span>
                        <span className="font-medium">{order.restaurant?.name || 'Restaurant'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        ${parseFloat(order.total_price || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="mb-4 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div className="text-gray-600 flex-1 truncate">
                          {order.items.slice(0, 2).map(item => item.menu_item_name || 'Item').join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <FiClock className="text-orange-500" />
                      {new Date(order.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-orange-600 font-semibold flex items-center gap-2">
                      View Details
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-8xl mb-6">
              {filter === 'all' ? '📦' : filter === 'active' ? '🏃' : filter === 'completed' ? '✅' : '❌'}
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-3">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              {filter === 'all' 
                ? 'Start ordering from your favorite restaurants!' 
                : `You don't have any ${filter} orders at the moment.`}
            </p>
            {filter === 'all' && (
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
              >
                <FiShoppingBag />
                Browse Restaurants
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
