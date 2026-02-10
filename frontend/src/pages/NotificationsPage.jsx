import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../store/slices/notificationSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { list: notifications, loading } = useSelector((state) => state.notifications);
  const [filter, setFilter] = useState('all'); // all, unread, orders, reservations

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    await dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
    alert('✅ All notifications marked as read');
  };

  const getTypeIcon = (type) => {
    const icons = {
      ORDER_UPDATE: '📦',
      RESERVATION_UPDATE: '📅',
      PROMOTION: '🎉',
      SYSTEM: '⚙️',
    };
    return icons[type] || '📢';
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'orders') return notification.type === 'ORDER_UPDATE';
    if (filter === 'reservations') return notification.type === 'RESERVATION_UPDATE';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">🔔 Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              ✓ Mark All as Read
            </button>
          )}
        </div>

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
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'unread'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('orders')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'orders'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setFilter('reservations')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'reservations'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📅 Reservations
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow p-4 transition ${
                  !notification.is_read ? 'border-l-4 border-orange-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        🕐 {new Date(notification.created_at).toLocaleString()}
                      </span>
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  {!notification.is_read && (
                    <div className="w-3 h-3 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You're all caught up!" 
                : `You don't have any ${filter} notifications.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
