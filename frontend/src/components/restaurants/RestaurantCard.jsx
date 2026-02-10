import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi';

const RestaurantCard = ({ restaurant, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link to={`/restaurants/${restaurant.id}`}>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            {restaurant.image || restaurant.cover_image ? (
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                src={restaurant.image || restaurant.cover_image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center">
                <span className="text-7xl">🍽️</span>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                {restaurant.is_open || restaurant.is_active ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm"
                  >
                    Open Now
                  </motion.span>
                ) : (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                    Closed
                  </span>
                )}
              </div>
              
              {restaurant.featured && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm"
                >
                  Featured
                </motion.span>
              )}
            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                <FiStar className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-gray-900">{restaurant.rating || '4.5'}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">
              {restaurant.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
              {restaurant.description || 'Delicious food awaits you!'}
            </p>

            <div className="space-y-2">
              {/* Cuisine Type */}
              {(restaurant.cuisine_type || (restaurant.cuisine_types && restaurant.cuisine_types.length > 0)) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {restaurant.cuisine_type || restaurant.cuisine_types[0]}
                  </span>
                </div>
              )}

              {/* Delivery Time */}
              <div className="flex items-center gap-2 text-gray-600">
                <FiClock className="text-orange-500 flex-shrink-0" />
                <span className="text-sm font-medium">{restaurant.delivery_time || '30-45'} min</span>
                <span className="text-gray-400">•</span>
                <FiDollarSign className="text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">${restaurant.delivery_fee || '2.99'} delivery</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600">
                <FiMapPin className="text-red-500 flex-shrink-0" />
                <span className="text-sm line-clamp-1">{restaurant.address || 'City Center'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;
