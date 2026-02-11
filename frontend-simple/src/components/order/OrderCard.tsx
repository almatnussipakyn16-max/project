import { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../api/types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import { ORDER_STATUSES, TEXTS } from '../../utils/constants';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const statusConfig = ORDER_STATUSES[order.status];

  return (
    <Link to={`/orders/${order.id}`}>
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">
              {TEXTS.orderNumber}: {order.order_number}
            </h3>
            <p className="text-sm text-gray-600">
              {order.restaurant.name}
            </p>
          </div>
          <Badge className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>Дата: {formatDateTime(order.created_at)}</p>
          <p>Тип: {TEXTS[order.order_type as keyof typeof TEXTS]}</p>
          {order.estimated_delivery_time && (
            <p>
              Ожидаемое время: {formatDateTime(order.estimated_delivery_time)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-gray-600">
            {order.items.length} позиций
          </span>
          <span className="text-xl font-bold text-primary-500">
            {formatPrice(order.total)}
          </span>
        </div>
      </Card>
    </Link>
  );
};
