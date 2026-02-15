import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservations';
import { Spinner } from '../../components/common/Spinner';

const ReservationsList: FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsApi.getAll(),
  });

  // ✅ Парсим results
  const reservations = data?.results || [];

  console.log('🔍 API data:', data);
  console.log('📋 Reservations:', reservations);
  console.log('📊 Count:', reservations.length);

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'SEATED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'NO_SHOW': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'PENDING': 'Ожидает подтверждения',
      'CONFIRMED': 'Подтверждено',
      'SEATED': 'За столом',
      'COMPLETED': 'Завершено',
      'CANCELLED': 'Отменено',
      'NO_SHOW': 'Не явился',
    };
    return texts[status] || status;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои бронирования</h1>
        <Link
          to="/reservations/create"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
        >
          + Создать бронирование
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">📅</span>
          <p className="text-gray-500 text-lg mb-4">
            У вас пока нет бронирований
          </p>
          <Link
            to="/reservations/create"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Забронировать столик
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation: any) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">
                      Бронирование #{reservation.reservation_number}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Ресторан ID: {reservation.restaurant}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Дата */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-500">Дата</p>
                    <p className="font-medium">{reservation.reservation_date}</p>
                  </div>
                </div>

                {/* Время */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="text-sm text-gray-500">Время</p>
                    <p className="font-medium">{reservation.reservation_time?.slice(0, 5)}</p>
                  </div>
                </div>

                {/* Гости */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="text-sm text-gray-500">Гостей</p>
                    <p className="font-medium">{reservation.guest_count}</p>
                  </div>
                </div>
              </div>

              {/* Особые пожелания */}
              {reservation.special_requests && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Особые пожелания:</p>
                  <p className="text-gray-700">{reservation.special_requests}</p>
                </div>
              )}

              {/* Действия */}
              <div className="flex gap-3">
                <Link
                  to={`/reservations/${reservation.id}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Подробнее
                </Link>
                {reservation.status === 'PENDING' && (
                  <button
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsList;