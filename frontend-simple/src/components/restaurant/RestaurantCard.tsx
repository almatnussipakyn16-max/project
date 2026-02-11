import { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../../api/types';
import { Card } from '../common/Card';
import { TEXTS } from '../../utils/constants';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant.id}`}>
      <Card hover className="h-full">
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <span>⭐ {Number(restaurant.rating).toFixed(1)}</span>
            </span>
            <span>•</span>
            <span>
              {restaurant.total_reviews} {TEXTS.reviews}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            {restaurant.cuisine_types.slice(0, 2).map((type, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {restaurant.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {restaurant.delivery_available && (
                <span className="text-green-600">🚚 {TEXTS.deliveryAvailable}</span>
              )}
            </div>
            <span className="font-medium text-primary-500">
              {restaurant.city}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
export default RestaurantCard;