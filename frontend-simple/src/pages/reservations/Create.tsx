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
    guest_count: 2,
    special_requests: '',
  });
  const [error, setError] = useState('');

  // Получить список ресторанов
  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getAll(),
  });

  // Создать бронь
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => reservationsApi.create(data),
    onSuccess: () => {
      navigate('/reservations');
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Ошибка создания бронирования');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.restaurant || !formData.reservation_date || !formData.reservation_time) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (formData.guest_count < 1 || formData.guest_count > 20) {
      setError('Количество гостей должно быть от 1 до 20');
      return;
    }

    createMutation.mutate({
      ...formData,
      restaurant: Number(formData.restaurant),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guest_count' ? Number(value) : value,
    }));
  };

  if (restaurantsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const restaurants = restaurantsData?.data?.results || restaurantsData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Создать бронирование</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Выбор ресторана */}
            <div className="mb-6">
              <label
                htmlFor="restaurant"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Дата */}
            <div className="mb-6">
              <label
                htmlFor="reservation_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="reservation_time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="guest_count"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Количество гостей <span className="text-red-500">*</span>
              </label>
              <input
                id="guest_count"
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Особые пожелания */}
            <div className="mb-6">
              <label
                htmlFor="special_requests"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Особые пожелания
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Например: окно с видом, детский стульчик и т.д."
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'Создание...' : 'Создать бронирование'}
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
      </div>
    </div>
  );
};

export default ReservationCreate;