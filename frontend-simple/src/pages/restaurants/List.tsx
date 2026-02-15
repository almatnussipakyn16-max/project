import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import { Spinner } from '../../components/common/Spinner';

const RestaurantList: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', searchQuery, cuisineFilter],
    queryFn: () => restaurantsApi.getAll({ 
      search: searchQuery || undefined,
      cuisine_types: cuisineFilter || undefined,
    }),
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
          <p className="text-red-800">Ошибка загрузки ресторанов</p>
        </div>
      </div>
    );
  }

  const restaurants = data?.results || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Рестораны</h1>

      {/* Фильтры */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Поиск */}
        <div>
          <input
            type="text"
            placeholder="🔍 Поиск ресторанов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Фильтр по кухне */}
        <div>
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Все кухни</option>
            <option value="ITALIAN">Итальянская</option>
            <option value="CHINESE">Китайская</option>
            <option value="JAPANESE">Японская</option>
            <option value="MEXICAN">Мексиканская</option>
            <option value="INDIAN">Индийская</option>
            <option value="AMERICAN">Американская</option>
            <option value="FRENCH">Французская</option>
            <option value="THAI">Тайская</option>
            <option value="MEDITERRANEAN">Средиземноморская</option>
            <option value="MIDDLE_EASTERN">Ближневосточная</option>
          </select>
        </div>
      </div>

      {/* Список ресторанов */}
      {restaurants.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-gray-500 text-lg mb-4">
            {searchQuery || cuisineFilter
              ? 'Ресторанов не найдено. Попробуйте изменить фильтры.'
              : 'Рестораны пока не добавлены'}
          </p>
          {(searchQuery || cuisineFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCuisineFilter('');
              }}
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;