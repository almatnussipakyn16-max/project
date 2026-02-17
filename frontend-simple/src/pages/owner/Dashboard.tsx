import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../../api/owner';
import { Spinner } from '../../components/common/Spinner';

const OwnerDashboard: FC = () => {
  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['owner-restaurant'],
    queryFn: ownerApi.getRestaurant,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: ownerApi.getOrders,
  });

  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['owner-reservations'],
    queryFn: ownerApi.getReservations,
  });

  if (restaurantLoading || ordersLoading || reservationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Restaurant Found</h2>
        <p className="text-gray-600">You don't have a restaurant associated with your account.</p>
      </div>
    );
  }

  const pendingOrders = orders?.filter(o => o.status === 'PENDING').length || 0;
  const pendingReservations = reservations?.filter(r => r.status === 'PENDING').length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
        <p className="text-gray-600">{restaurant.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Pending Orders</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Pending Reservations</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{pendingReservations}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{orders?.length || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Restaurant Rating</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{restaurant.rating || 'N/A'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <span className="text-3xl block mb-2">🏪</span>
            <h3 className="font-semibold">Manage Restaurant</h3>
            <p className="text-sm text-gray-600">Coming soon</p>
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <span className="text-3xl block mb-2">📋</span>
            <h3 className="font-semibold">Manage Menu</h3>
            <p className="text-sm text-gray-600">Coming soon</p>
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg text-center">
            <span className="text-3xl block mb-2">🪑</span>
            <h3 className="font-semibold">Manage Tables</h3>
            <p className="text-sm text-gray-600">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600">
                        {order.order_type} - ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No orders yet</p>
          )}
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Reservations</h2>
          {reservations && reservations.length > 0 ? (
            <div className="space-y-3">
              {reservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{reservation.guest_count} guests</p>
                      <p className="text-sm text-gray-600">
                        {reservation.reservation_date} at {reservation.reservation_time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No reservations yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
