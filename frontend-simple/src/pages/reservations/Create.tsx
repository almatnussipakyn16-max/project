import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservations';
import { restaurantsApi } from '../../api/restaurants';
import { Spinner } from '../../components/common/Spinner';

const ReservationCreate: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurant: '',
    reservation_date: '',
    reservation_time: '',
    guest_count: 2,  // ✅ Изменил с party_size на guest_count
    special_requests: '',
  });
  const [error, setError] = useState('');

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getAll(),
  });

  const restaurants = restaurantsData?.results || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => reservationsApi.create(data),
    onSuccess: () => {
      navigate('/reservations');
    },
    onError: (error: any) => {
      console.error('Reservation error:', error.response?.data);
      const errorMsg = error.response?.data?.detail 
        || error.response?.data?.message
        || JSON.stringify(error.response?.data)
        || 'Ошибка создания бронирования';
      setError(errorMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.restaurant || !formData.reservation_date || !formData.reservation_time) {
      setError('Заполните все обязательные поля');
      return;
    }

    console.log('Submitting reservation:', formData);
    createMutation.mutate({
      restaurant: Number(formData.restaurant),
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      guest_count: Number(formData.guest_count),  // ✅ guest_count
      special_requests: formData.special_requests,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (restaurantsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Забронировать столик</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 whitespace-pre-wrap">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Выбор ресторана */}
            <div className="mb-6">
              <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-2">
                Ресторан <span className="text-red-500">*</span>
              </label>
              <select
                id="restaurant"
                name="restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Выберите ресторан</option>
                {restaurants.map((restaurant: any) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} - {restaurant.city}
                  </option>
                ))}
              </select>
              {restaurants.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Рестораны не найдены
                </p>
              )}
            </div>

            {/* Дата */}
            <div className="mb-6">
              <label htmlFor="reservation_date" className="block text-sm font-medium text-gray-700 mb-2">
                Дата <span className="text-red-500">*</span>
              </label>
              <input
                id="reservation_date"
                type="date"
                name="reservation_date"
                value={formData.reservation_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Время */}
            <div className="mb-6">
              <label htmlFor="reservation_time" className="block text-sm font-medium text-gray-700 mb-2">
                Время <span className="text-red-500">*</span>
              </label>
              <input
                id="reservation_time"
                type="time"
                name="reservation_time"
                value={formData.reservation_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Количество гостей */}
            <div className="mb-6">
              <label htmlFor="guest_count" className="block text-sm font-medium text-gray-700 mb-2">
                Количество гостей
              </label>
              <input
                id="guest_count"
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleChange}
                min={1}
                max={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Особые пожелания */}
            <div className="mb-6">
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                Особые пожелания
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Детское кресло, столик у окна и т.д."
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {createMutation.isPending ? 'Бронирование...' : 'Забронировать'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/reservations')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>

        {/* Информация */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">ℹ️ Информация</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Бронирование подтверждается автоматически</li>
            <li>Вы получите уведомление на email</li>
            <li>Отменить бронь можно за 2 часа до времени</li>
            <li>При опоздании более 15 минут бронь может быть отменена</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReservationCreate;