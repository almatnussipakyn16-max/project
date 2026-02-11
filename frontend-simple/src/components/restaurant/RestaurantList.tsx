import { FC } from 'react';
import type { Restaurant } from '../../api/types';
import { RestaurantCard } from './RestaurantCard';
import { Spinner } from '../common/Spinner';
import { TEXTS } from '../../utils/constants';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}

export const RestaurantList: FC<RestaurantListProps> = ({ restaurants, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{TEXTS.noResults}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};