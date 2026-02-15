import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../api/restaurants';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { Spinner } from '../components/common/Spinner';

const Home: FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getAll(),
  });

  // data уже { count, results, next, previous }
  const restaurants = data?.results || [];

  console.log('API Response:', data);
  console.log('Restaurants:', restaurants);

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
          <p className="text-red-800">Ошибка загрузки ресторанов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секция */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Добро пожаловать в Рестораны.КЗ
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Бронируйте столики в лучших ресторанах Казахстана. 
            Заказывайте еду онлайн с доставкой.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/reservations/create"
              className="px-8 py-3 bg-white text-orange-500 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Забронировать столик
            </Link>
            <Link
              to="/promotions"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-orange-500 transition"
            >
              Акции и скидки
            </Link>
          </div>
        </div>
      </section>

      {/* Рестораны */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Наши рестораны</h2>
          {data?.count && (
            <p className="text-gray-600">Всего ресторанов: {data.count}</p>
          )}
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-gray-500 text-lg">Рестораны скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* Преимущества */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Почему выбирают нас?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Быстрое бронирование</h3>
              <p className="text-gray-600">
                Забронируйте столик за 1 минуту
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Акции и скидки</h3>
              <p className="text-gray-600">
                Специальные предложения каждую неделю
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Лучшие рестораны</h3>
              <p className="text-gray-600">
                Только проверенные заведения
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;