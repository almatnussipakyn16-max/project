import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservations';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../../utils/formatters';
import { TEXTS } from '../../utils/constants';

export const ReservationListPage: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsApi.getAll(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{TEXTS.reservations}</h1>
        <Link to="/reservations/create">
          <Button>{TEXTS.makeReservation}</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data?.results && data.results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((reservation) => (
            <Card key={reservation.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {reservation.restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {reservation.reservation_number}
                  </p>
                </div>
                <Badge
                  variant={
                    reservation.status === 'CONFIRMED'
                      ? 'success'
                      : reservation.status === 'CANCELLED'
                      ? 'error'
                      : 'default'
                  }
                >
                  {reservation.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  📅 {formatDate(reservation.reservation_date)}
                </p>
                <p>
                  🕐 {formatTime(reservation.reservation_time)}
                </p>
                <p>
                  👥 {reservation.guest_count} гостей
                </p>
                {reservation.special_requests && (
                  <p className="text-xs mt-2">
                    Пожелания: {reservation.special_requests}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">{TEXTS.noResults}</p>
          <Link to="/reservations/create">
            <Button>{TEXTS.makeReservation}</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
