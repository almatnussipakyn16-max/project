import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { OrderStatus } from '../../components/order/OrderStatus';
import { Spinner } from '../../components/common/Spinner';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import { TEXTS } from '../../utils/constants';

export const OrderDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(Number(id)),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancel(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleCancel = () => {
    if (confirm('Вы уверены, что хотите отменить заказ?')) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Заказ не найден</p>
      </div>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate('/orders')}>
          ← Назад к заказам
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Order Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {TEXTS.orderNumber}: {order.order_number}
              </h1>
              <p className="text-gray-600">
                Создан: {formatDateTime(order.created_at)}
              </p>
            </div>
            {canCancel && (
              <Button
                variant="danger"
                onClick={handleCancel}
                isLoading={cancelMutation.isPending}
              >
                Отменить заказ
              </Button>
            )}
          </div>

          <OrderStatus status={order.status} showProgress />
        </Card>

        {/* Restaurant Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ресторан</h2>
          <div className="space-y-2">
            <p className="font-medium text-lg">{order.restaurant.name}</p>
            <p className="text-gray-600">{order.restaurant.address_line1}</p>
            <p className="text-gray-600">{order.restaurant.phone}</p>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Позиции заказа</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b">
                <div className="flex-1">
                  <p className="font-medium">{item.menu_item.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                  {item.special_instructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Примечание: {item.special_instructions}
                    </p>
                  )}
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Info */}
        {order.delivery_address && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Адрес доставки</h2>
            <div className="space-y-1 text-gray-600">
              <p>{order.delivery_address.address_line1}</p>
              {order.delivery_address.address_line2 && (
                <p>{order.delivery_address.address_line2}</p>
              )}
              <p>
                {order.delivery_address.city}, {order.delivery_address.postal_code}
              </p>
              {order.delivery_instructions && (
                <p className="mt-2 text-sm">
                  <strong>Примечания:</strong> {order.delivery_instructions}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Итого</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Подытог:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {parseFloat(order.delivery_fee) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Доставка:</span>
                <span>{formatPrice(order.delivery_fee)}</span>
              </div>
            )}
            {parseFloat(order.tax) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Налог:</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Скидка:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between text-xl font-bold">
                <span>Итого:</span>
                <span className="text-primary-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
