import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders';
import OrderCard from '../../components/order/OrderCard';
import { Spinner } from '../../components/common/Spinner';
import type { OrderStatus } from '../../types';

const OrderList: FC = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => ordersApi.getAll(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
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
          <p className="text-red-800">Ошибка загрузки заказов</p>
        </div>
      </div>
    );
  }

  const orders = data?.results || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои заказы</h1>
        
        {/* Фильтр по статусу */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="ALL">Все заказы</option>
          <option value="PENDING">Ожидает</option>
          <option value="CONFIRMED">Подтверждён</option>
          <option value="PREPARING">Готовится</option>
          <option value="READY">Готов</option>
          <option value="OUT_FOR_DELIVERY">В пути</option>
          <option value="DELIVERED">Доставлен</option>
          <option value="CANCELLED">Отменён</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">📦</span>
          <p className="text-gray-500 text-lg mb-4">
            {statusFilter === 'ALL' 
              ? 'У вас пока нет заказов' 
              : `Нет заказов со статусом "${statusFilter}"`}
          </p>
          <Link
            to="/restaurants"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Перейти к ресторанам
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;