import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { RestaurantList } from '../../components/restaurant/RestaurantList';
import { Input } from '../../components/common/Input';
import { useDebounce } from '../../hooks/useDebounce';
import { TEXTS, CUISINE_TYPES } from '../../utils/constants';

export const RestaurantListPage: FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', debouncedSearch, selectedCuisine],
    queryFn: () => restaurantsApi.getAll({
      search: debouncedSearch,
      cuisine_types: selectedCuisine,
    }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{TEXTS.restaurants}</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Все кухни</option>
            {CUISINE_TYPES.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <RestaurantList 
        restaurants={data?.results || []} 
        isLoading={isLoading}
      />
    </div>
  );
};
