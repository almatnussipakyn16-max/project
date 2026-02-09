import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRestaurants } from '../../store/slices/restaurantSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { list: restaurants, loading } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Order Food from Your Favorite Restaurants
          </h1>
          <p className="text-xl mb-8">
            Delicious meals delivered to your doorstep
          </p>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              className="w-full px-6 py-4 rounded-lg text-gray-800 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Restaurants</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200 relative">
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
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{restaurant.description?.slice(0, 100)}...</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1">{restaurant.rating || 'New'}</span>
                      <span className="text-gray-500 ml-1">({restaurant.total_reviews || 0})</span>
                    </div>
                    <span className="text-gray-600">{restaurant.price_range}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && restaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No restaurants available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
