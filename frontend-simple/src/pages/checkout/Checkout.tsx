import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders';
import { useCartStore } from '../../store/cart';
import { Spinner } from '../../components/common/Spinner';

const Checkout: FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    orderType: 'DELIVERY' as 'DELIVERY' | 'TAKEOUT',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    notes: '',
  });
  const [error, setError] = useState('');

  // Создание заказа
  const createOrderMutation = useMutation({
    mutationFn: (data: any) => ordersApi.create(data),
    onSuccess: (response) => {
      clearCart();
      navigate(`/orders/${response.data.id}`);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.detail 
        || error.response?.data?.message
        || JSON.stringify(error.response?.data)
        || 'Ошибка создания заказа';
      setError(errorMsg);
      console.error('Order creation error:', error.response?.data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Корзина пуста');
      return;
    }

    // Валидация для доставки
    if (formData.orderType === 'DELIVERY') {
      if (!formData.address || !formData.city || !formData.phone) {
        setError('Заполните все обязательные поля для доставки');
        return;
      }
    }

    // Получить ID ресторана из первого товара
    const restaurantId = items[0]?.menuItem?.category?.restaurant 
      || items[0]?.menuItem?.restaurant
      || null;

    if (!restaurantId) {
      setError('Не удалось определить ресторан');
      return;
    }

    // Формируем данные заказа
    const orderData: any = {
      restaurant: Number(restaurantId),
      order_type: formData.orderType,
      items: items.map(item => ({
        menu_item: item.menuItem.id,
        quantity: item.quantity,
        unit_price: String(item.menuItem.price),
      })),
    };

    // Добавляем адрес доставки если нужно
    if (formData.orderType === 'DELIVERY') {
      orderData.delivery_address = {
        address_line1: formData.address,
        city: formData.city,
        postal_code: formData.postalCode || '000000',
        phone: formData.phone,
      };
    }

    // Добавляем заметки если есть
    if (formData.notes) {
      orderData.special_instructions = formData.notes;
    }

    console.log('Creating order with data:', orderData);
    createOrderMutation.mutate(orderData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-4 block">🛒</span>
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Перейти к ресторанам
        </button>
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Форма */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Тип заказа */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип заказа
                </label>
                <select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="DELIVERY">🚚 Доставка</option>
                  <option value="TAKEOUT">🏪 Самовывоз</option>
                </select>
              </div>

              {/* Поля для доставки */}
              {formData.orderType === 'DELIVERY' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Адрес <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Улица, дом, квартира"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Город <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Индекс
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="+7 777 123 4567"
                      required
                    />
                  </div>
                </>
              )}

              {/* Комментарий */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий к заказу
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Особые пожелания..."
                />
              </div>

              {/* Кнопка */}
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {createOrderMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    Оформление...
                  </span>
                ) : (
                  'Оформить заказ'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Сводка */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">Ваш заказ</h3>

            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span>{item.menuItem.name} x{item.quantity}</span>
                  <span>{(Number(item.menuItem.price) * item.quantity).toFixed(2)} ₸</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Подытог:</span>
                <span>{total.toFixed(2)} ₸</span>
              </div>
              {formData.orderType === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span>500.00 ₸</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Итого:</span>
                <span className="text-orange-500">
                  {(total + (formData.orderType === 'DELIVERY' ? 500 : 0)).toFixed(2)} ₸
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;