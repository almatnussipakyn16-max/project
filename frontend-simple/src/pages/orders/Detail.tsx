import { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders';
import { Spinner } from '../../components/common/Spinner';
import { OrderStatus } from '../../components/order/OrderStatus';

const OrderDetail: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Заказ не найден</p>
          <Link to="/orders" className="text-orange-500 hover:underline mt-2 inline-block">
            ← Вернуться к заказам
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок */}
        <div className="mb-6">
          <Link to="/orders" className="text-orange-500 hover:underline mb-2 inline-block">
            ← Вернуться к заказам
          </Link>
          <h1 className="text-3xl font-bold">Заказ {order.order_number}</h1>
          <p className="text-gray-600">{orderDate}</p>
        </div>

        {/* Статус */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Статус заказа</h2>
          <OrderStatus status={order.status} />
        </div>

        {/* Детали заказа */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Детали</h2>
          
          {order.restaurant_details && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600">Ресторан</p>
              <p className="font-semibold">{order.restaurant_details.name}</p>
            </div>
          )}

          <div className="mb-4 pb-4 border-b">
            <p className="text-sm text-gray-600">Тип заказа</p>
            <p className="font-semibold">
              {order.order_type === 'DELIVERY' && '🚚 Доставка'}
              {order.order_type === 'TAKEOUT' && '🏪 Самовывоз'}
              {order.order_type === 'DINE_IN' && '🍽️ В ресторане'}
            </p>
          </div>

          {order.delivery_address && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600">Адрес доставки</p>
              <p className="font-semibold">
                {typeof order.delivery_address === 'string' 
                  ? order.delivery_address 
                  : JSON.stringify(order.delivery_address)}
              </p>
            </div>
          )}

          {order.delivery_instructions && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600">Комментарий к заказу</p>
              <p className="font-semibold">{order.delivery_instructions}</p>
            </div>
          )}
        </div>

        {/* Товары */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Товары</h2>
          <div className="space-y-4">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold">
                    {item.menu_item_details?.name || `Товар #${item.menu_item}`}
                  </p>
                  {item.special_instructions && (
                    <p className="text-sm text-gray-600">{item.special_instructions}</p>
                  )}
                  <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Number(item.subtotal).toFixed(2)} ₸</p>
                  <p className="text-sm text-gray-500">{Number(item.unit_price).toFixed(2)} ₸ × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Итого */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Итого</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Подытог:</span>
              <span>{Number(order.subtotal).toFixed(2)} ₸</span>
            </div>
            {Number(order.tax) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Налог:</span>
                <span>{Number(order.tax).toFixed(2)} ₸</span>
              </div>
            )}
            {Number(order.delivery_fee) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка:</span>
                <span>{Number(order.delivery_fee).toFixed(2)} ₸</span>
              </div>
            )}
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Скидка:</span>
                <span>-{Number(order.discount).toFixed(2)} ₸</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-orange-600">{Number(order.total).toFixed(2)} ₸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;