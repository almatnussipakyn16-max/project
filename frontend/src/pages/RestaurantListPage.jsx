import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRestaurants, searchRestaurants } from '../store/slices/restaurantSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RestaurantListPage = () => {
  const dispatch = useDispatch();
  const { list: restaurants, loading } = useSelector((state) => state.restaurants);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchRestaurants(searchQuery));
    } else {
      dispatch(fetchRestaurants());
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            🍽️ Discover Amazing Restaurants
          </h1>
          <p className="text-xl mb-8 text-orange-100">
            Order from your favorite local restaurants
          </p>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex shadow-lg">
              <input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 rounded-l-lg text-gray-800 text-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-orange-700 px-8 py-4 rounded-r-lg hover:bg-orange-800 font-semibold transition"
              >
                🔍 Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Restaurants</h2>
          <div className="text-gray-600">
            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 relative">
                  {restaurant.cover_image ? (
                    <img
                      src={restaurant.cover_image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}
                  {restaurant.is_active ? (
                    <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Open
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ✗ Closed
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {restaurant.description || 'Delicious food awaits you!'}
                  </p>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="ml-1 font-semibold">
                        {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({restaurant.total_reviews || 0})
                      </span>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {restaurant.price_range || '$$'}
                    </span>
                  </div>

                  {/* Cuisines */}
                  {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {restaurant.cuisine_types.slice(0, 3).map((cuisine, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {cuisine}
                        </span>
                      ))}
                      {restaurant.cuisine_types.length > 3 && (
                        <span className="text-gray-500 text-xs py-1">
                          +{restaurant.cuisine_types.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  {restaurant.address && (
                    <p className="text-gray-500 text-xs mt-3 truncate">
                      📍 {restaurant.address}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListPage;
