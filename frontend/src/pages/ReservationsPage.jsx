import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchReservations, cancelReservation } from '../store/slices/reservationSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReservationsPage = () => {
  const dispatch = useDispatch();
  const { list: reservations, loading } = useSelector((state) => state.reservations);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    const result = await dispatch(cancelReservation(id));
    
    if (!result.error) {
      toast.success('Reservation cancelled successfully');
    } else {
      const errorMessage = result.error?.message || 'Unknown error';
      toast.error(`Failed to cancel reservation: ${errorMessage}`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      CONFIRMED: { text: 'Confirmed', color: 'bg-green-100 text-green-800', icon: '✅' },
      CANCELLED: { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' },
      COMPLETED: { text: 'Completed', color: 'bg-gray-100 text-gray-800', icon: '✓' },
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const filteredReservations = reservations.filter((reservation) => {
    const reservationDate = new Date(reservation.reservation_date + 'T' + reservation.reservation_time);
    const now = new Date();
    
    if (filter === 'all') return true;
    if (filter === 'upcoming') return reservationDate >= now && reservation.status !== 'CANCELLED';
    if (filter === 'past') return reservationDate < now || reservation.status === 'COMPLETED';
    if (filter === 'cancelled') return reservation.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">📅 My Reservations</h1>

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
            All ({reservations.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'upcoming'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'past'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              filter === 'cancelled'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Reservations List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => {
              const canCancel = reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';
              
              return (
                <div key={reservation.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        🍽️ {reservation.restaurant?.name || 'Restaurant'}
                      </h3>
                      <p className="text-gray-600">
                        Reservation #{reservation.id}
                      </p>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Date</div>
                      <div className="font-semibold">
                        📅 {new Date(reservation.reservation_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Time</div>
                      <div className="font-semibold">
                        🕐 {reservation.reservation_time}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Party Size</div>
                      <div className="font-semibold">
                        👥 {reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                  </div>

                  {reservation.special_requests && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Special Requests</div>
                      <div className="text-gray-800">{reservation.special_requests}</div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        ❌ Cancel
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                      📞 Contact Restaurant
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No reservations found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Make your first reservation at your favorite restaurant!' 
                : `You don't have any ${filter} reservations.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;
