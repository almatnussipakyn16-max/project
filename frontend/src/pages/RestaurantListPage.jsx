import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRestaurants, searchRestaurants } from '../store/slices/restaurantSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiStar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RestaurantListPage = () => {
  const dispatch = useDispatch();
  const { list: restaurants, loading } = useSelector((state) => state.restaurants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchRestaurants(searchTerm));
    } else {
      dispatch(fetchRestaurants());
    }
  };

  const categories = ['all', 'italian', 'chinese', 'mexican', 'indian', 'american', 'japanese'];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine_types?.some(ct => ct.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           restaurant.cuisine_types?.some(ct => ct.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Discover Restaurants
          </h1>
          <p className="text-gray-600">Find your favorite food and order now!</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>
          </form>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>
        {/* Restaurants Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredRestaurants.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/restaurants/${restaurant.id}`}>
                  <motion.div
                    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 relative overflow-hidden">
                      {restaurant.cover_image ? (
                        <img
                          src={restaurant.cover_image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🍽️
                        </div>
                      )}
                      {restaurant.is_active ? (
                        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Open Now
                        </span>
                      ) : (
                        <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Closed
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {restaurant.description || 'Delicious food awaits you!'}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiStar className="text-yellow-500" />
                          <span className="font-semibold">
                            {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm">{restaurant.price_range || '$$'}</span>
                        </div>
                        {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {restaurant.cuisine_types.slice(0, 3).map((cuisine, idx) => (
                              <span
                                key={idx}
                                className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {cuisine}
                              </span>
                            ))}
                          </div>
                        )}
                        {restaurant.address && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMapPin className="text-red-500" />
                            <span className="text-sm line-clamp-1">{restaurant.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListPage;
