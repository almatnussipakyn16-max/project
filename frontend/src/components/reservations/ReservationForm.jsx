import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReservation } from '../../store/slices/reservationSlice';

const ReservationForm = ({ restaurantId, restaurantName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    party_size: 2,
    special_requests: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservationData = {
        restaurant: restaurantId,
        reservation_date: formData.date,
        reservation_time: formData.time,
        party_size: parseInt(formData.party_size),
        special_requests: formData.special_requests,
      };

      const result = await dispatch(createReservation(reservationData));
      
      if (!result.error) {
        alert('✅ Reservation created successfully!');
        navigate('/reservations');
      } else {
        alert('❌ Failed to create reservation: ' + (result.error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('❌ Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Make a Reservation</h2>
      <p className="text-gray-600 mb-6">at {restaurantName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Size *
          </label>
          <select
            name="party_size"
            value={formData.party_size}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            rows="3"
            placeholder="e.g., Window seat, birthday celebration..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold disabled:bg-gray-400"
        >
          {loading ? 'Creating Reservation...' : '📅 Reserve Table'}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
