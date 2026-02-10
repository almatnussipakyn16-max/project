import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../../store/slices/restaurantSlice';
import { addToCart } from '../../store/slices/cartSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReservationForm from '../../components/reservations/ReservationForm';
import { FiStar, FiClock, FiMapPin, FiPhone, FiShoppingCart, FiPlus } from 'react-icons/fi';
import { BiDollar } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: restaurant, loading } = useSelector((state) => state.restaurants);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [id, dispatch]);

  const handleAddToCart = (item) => {
    try {
      dispatch(addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
        },
      }));
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading || !restaurant) {
    return <LoadingSpinner fullScreen />;
  }

  const menuItems = restaurant.menu_items || [];
  const categories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  // Mock images for gallery (replace with real data)
  const galleryImages = [
    restaurant.image || restaurant.cover_image,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  ].filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        {galleryImages.length > 1 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="h-full"
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full">
                  <img
                    src={image}
                    alt={`${restaurant.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative h-full">
            {restaurant.image || restaurant.cover_image ? (
              <img
                src={restaurant.image || restaurant.cover_image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                <span className="text-9xl">🍽️</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <FiStar className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{restaurant.rating || '4.5'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>{restaurant.delivery_time || '30-45'} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiDollar />
                  <span>${restaurant.delivery_fee || '2.99'} delivery</span>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  restaurant.is_open || restaurant.is_active 
                    ? 'bg-green-500/80 backdrop-blur-sm' 
                    : 'bg-red-500/80 backdrop-blur-sm'
                }`}>
                  {restaurant.is_open || restaurant.is_active ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Restaurant Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 mb-6">
                {restaurant.description || 'Welcome to our restaurant! We serve delicious food made with fresh ingredients.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-red-500 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">{restaurant.address || 'City Center'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="text-blue-500 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">{restaurant.phone || '+1 (234) 567-890'}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Menu Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Menu</h2>

              {/* Category Filters */}
              {categories.length > 1 && (
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Menu Items */}
              <div className="space-y-4">
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition group"
                    >
                      {/* Item Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-200 to-orange-300">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description || 'Delicious and freshly prepared'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-orange-600">
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                          {item.is_available === false && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              Not Available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(item)}
                        disabled={item.is_available === false}
                        className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus className="text-xl" />
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">🍽️</div>
                    <p className="text-gray-600">No menu items available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ReservationForm
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RestaurantDetailPage;
