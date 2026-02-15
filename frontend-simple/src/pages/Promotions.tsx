import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { promotionsApi } from '../api/promotions';
import { Spinner } from '../components/common/Spinner';
import type { Promotion } from '../api/types';

const Promotions: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.getAll(),
  });

  const promotions = data?.results || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🎁 Акции и промокоды</h1>
          <p className="text-gray-600 text-lg">
            Специальные предложения от наших ресторанов
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🎉</span>
            <p className="text-gray-500 text-lg">
              Акций пока нет. Следите за обновлениями!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo: Promotion) => {
              const isActive = new Date(promo.start_date) <= new Date() && 
                             new Date(promo.end_date) >= new Date() &&
                             promo.is_active;
              
              const discountText = 
                promo.discount_type === 'PERCENTAGE' 
                  ? `${promo.discount_value}% скидка`
                  : promo.discount_type === 'FIXED'
                  ? `${promo.discount_value} ₸ скидка`
                  : 'Купи 1 - получи 2';

              return (
                <div
                  key={promo.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    !isActive ? 'opacity-60' : ''
                  }`}
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold">{discountText}</span>
                      {!isActive && (
                        <span className="bg-white text-orange-500 px-2 py-1 rounded text-xs font-medium">
                          Неактивна
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold">{promo.name}</h3>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{promo.description}</p>

                    {/* Промокод */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Промокод:</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-orange-500 font-mono">
                          {promo.code}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(promo.code);
                            alert('Промокод скопирован!');
                          }}
                          className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                        >
                          📋 Копировать
                        </button>
                      </div>
                    </div>

                    {/* Детали */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {promo.minimum_order_amount > 0 && (
                        <p>📦 Минимальный заказ: {promo.minimum_order_amount} ₸</p>
                      )}
                      {promo.max_discount && (
                        <p>💰 Макс. скидка: {promo.max_discount} ₸</p>
                      )}
                      {promo.max_uses && (
                        <p>
                          👥 Использовано: {promo.current_uses} / {promo.max_uses}
                        </p>
                      )}
                      {promo.max_uses_per_user && (
                        <p>
                          👤 Макс. использований на пользователя: {promo.max_uses_per_user}
                        </p>
                      )}
                      <p>
                        📅 Действует с:{' '}
                        {new Date(promo.start_date).toLocaleDateString('ru-RU')}
                      </p>
                      <p>
                        📅 Действует до:{' '}
                        {new Date(promo.end_date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>

                    {/* Ресторан */}
                    {promo.restaurant && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Ресторан: <span className="font-medium">{promo.restaurant.name}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Информация */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">ℹ️ Как использовать промокод?</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Выберите блюда и добавьте их в корзину</li>
            <li>Перейдите к оформлению заказа</li>
            <li>Введите промокод в специальное поле</li>
            <li>Скидка применится автоматически</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Promotions;