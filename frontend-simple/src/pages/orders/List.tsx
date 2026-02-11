import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders';
import { OrderCard } from '../../components/order/OrderCard';
import { Spinner } from '../../components/common/Spinner';
import { TEXTS } from '../../utils/constants';
import type { OrderStatus } from '../../api/types';

export const OrderListPage: FC = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => ordersApi.getAll(statusFilter ? { status: statusFilter } : {}),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{TEXTS.myOrders}</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Все заказы</option>
          <option value="PENDING">Ожидает</option>
          <option value="CONFIRMED">Подтверждён</option>
          <option value="PREPARING">Готовится</option>
          <option value="OUT_FOR_DELIVERY">В пути</option>
          <option value="DELIVERED">Доставлен</option>
          <option value="CANCELLED">Отменён</option>
        </select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data?.results && data.results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{TEXTS.noResults}</p>
        </div>
      )}
    </div>
  );
};
