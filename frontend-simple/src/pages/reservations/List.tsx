import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservations';
import { Spinner } from '../../components/common/Spinner';

const ReservationList: FC = () => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['reservations', statusFilter],
    queryFn: () => reservationsApi.getAll(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки бронирований</p>
        </div>
      </div>
    );
  }

  const reservations = data?.data?.results || data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои бронирования</h1>
        
        {/* Кнопка создать бронь */}
        <Link
          to="/reservations/create"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
        >
          + Создать бронь
        </Link>
      </div>

      {/* Фильтр по статусу */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="ALL">Все бронирования</option>
          <option value="PENDING">Ожидает</option>
          <option value="CONFIRMED">Подтверждено</option>
          <option value="CANCELLED">Отменено</option>
        </select>
      </div>

      {/* Список бронирований */}
      {reservations.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">📅</span>
          <p className="text-gray-500 text-lg mb-4">
            {statusFilter === 'ALL' 
              ? 'У вас пока нет бронирований' 
              : `Нет бронирований со статусом "${statusFilter}"`}
          </p>
          <Link
            to="/reservations/create"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Создать бронирование
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation: any) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Бронь #{reservation.reservation_number || reservation.id}
                  </p>
                  <h3 className="text-xl font-bold mt-1">
                    {reservation.restaurant?.name || 'Ресторан'}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reservation.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {reservation.status === 'CONFIRMED' && 'Подтверждено'}
                  {reservation.status === 'PENDING' && 'Ожидает'}
                  {reservation.status === 'CANCELLED' && 'Отменено'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Дата</p>
                  <p className="font-medium">
                    {new Date(reservation.reservation_date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Время</p>
                  <p className="font-medium">{reservation.reservation_time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Гостей</p>
                  <p className="font-medium">{reservation.guest_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Стол</p>
                  <p className="font-medium">
                    {reservation.table?.table_number || 'Не назначен'}
                  </p>
                </div>
              </div>

              {reservation.special_requests && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Особые пожелания:</p>
                  <p className="text-gray-700">{reservation.special_requests}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationList;