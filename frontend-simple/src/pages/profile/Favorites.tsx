import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../../api/favorites';
import { Spinner } from '../../components/common/Spinner';

const Favorites: FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const favorites = data?.results || [];

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <span className="text-6xl mb-4 block">❤️</span>
          <h2 className="text-2xl font-bold mb-4">No Favorites Yet</h2>
          <p className="text-gray-500 mb-8">
            Start adding your favorite restaurants to see them here
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorite Restaurants</h1>
        <p className="text-gray-600 mt-2">{favorites.length} restaurant(s)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* Cover Image */}
            {favorite.restaurant.cover_image && (
              <img
                src={favorite.restaurant.cover_image}
                alt={favorite.restaurant.name}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6">
              {/* Restaurant Name */}
              <h3 className="text-xl font-bold mb-2">
                {favorite.restaurant.name}
              </h3>

              {/* Cuisine Types */}
              {favorite.restaurant.cuisine_types && favorite.restaurant.cuisine_types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {favorite.restaurant.cuisine_types.map((cuisine, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {favorite.restaurant.description}
              </p>

              {/* Location */}
              <p className="text-sm text-gray-500 mb-4">
                📍 {favorite.restaurant.city}, {favorite.restaurant.state}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold">{favorite.restaurant.rating || 'N/A'}</span>
                <span className="text-gray-500 text-sm">
                  ({favorite.restaurant.total_reviews || 0} reviews)
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/restaurants/${favorite.restaurant.id}`}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => removeMutation.mutate(favorite.id)}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                  disabled={removeMutation.isPending}
                >
                  {removeMutation.isPending ? '...' : '❤️'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
