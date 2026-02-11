import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../api/restaurants';
import { RestaurantList } from '../components/restaurant/RestaurantList';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TEXTS } from '../utils/constants';

export const Home: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', 'featured'],
    queryFn: () => restaurantsApi.getAll({ page_size: 6 }),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Добро пожаловать в платформу доставки еды
            </h1>
            <p className="text-xl mb-8">
              Закажите еду из лучших ресторанов Казахстана
            </p>
            <div className="flex gap-4 max-w-2xl mx-auto">
              <Input
                placeholder="Поиск ресторанов..."
                className="flex-1"
              />
              <Button variant="secondary">
                {TEXTS.search}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🍔</div>
              <h3 className="text-xl font-semibold mb-2">Лучшие рестораны</h3>
              <p className="text-gray-600">
                Сотни ресторанов с разнообразной кухней
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">
                Доставим ваш заказ в кратчайшие сроки
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Удобная оплата</h3>
              <p className="text-gray-600">
                Оплачивайте картой, наличными или электронным кошельком
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Популярные рестораны</h2>
            <Link to="/restaurants">
              <Button variant="secondary">Все рестораны →</Button>
            </Link>
          </div>
          <RestaurantList 
            restaurants={data?.results || []} 
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы сделать заказ?
          </h2>
          <p className="text-xl mb-8">
            Выберите ресторан и начните заказывать прямо сейчас
          </p>
          <Link to="/restaurants">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Посмотреть рестораны
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
