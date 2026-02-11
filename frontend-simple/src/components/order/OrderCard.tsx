import { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types';

interface OrderCardProps {
  order: Order;
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  // Конфигурация статусов
  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Подтверждён', color: 'bg-blue-100 text-blue-800' },
    PREPARING: { label: 'Готовится', color: 'bg-purple-100 text-purple-800' },
    READY: { label: 'Готов', color: 'bg-green-100 text-green-800' },
    OUT_FOR_DELIVERY: { label: 'В пути', color: 'bg-indigo-100 text-indigo-800' },
    DELIVERED: { label: 'Доставлен', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Отменён', color: 'bg-red-100 text-red-800' },
  };

  // ✅ Безопасное получение конфигурации с fallback
  const config = statusConfig[order.status] || { 
    label: order.status, 
    color: 'bg-gray-100 text-gray-800' 
  };

  // Форматирование даты
  const orderDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">Заказ {order.order_number}</p>
          <p className="text-sm text-gray-400">{orderDate}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Ресторан */}
      <div className="mb-4">
        <p className="font-semibold">{order.restaurant?.name || 'Ресторан'}</p>
        <p className="text-sm text-gray-600">
          {order.items?.length || 0} {order.items?.length === 1 ? 'позиция' : 'позиции'}
        </p>
      </div>

      {/* Сумма */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-gray-600">Итого:</span>
        <span className="text-xl font-bold text-orange-500">
          {Number(order.total).toFixed(2)} ₸
        </span>
      </div>
    </Link>
  );
};

export default OrderCard;