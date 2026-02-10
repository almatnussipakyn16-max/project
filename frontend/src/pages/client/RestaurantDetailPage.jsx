import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../../store/slices/restaurantSlice';
import { menuService } from '../../services';
import { addToCart } from '../../store/slices/cartSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReservationForm from '../../components/reservations/ReservationForm';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: restaurant, loading } = useSelector((state) => state.restaurants);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const loadMenu = useCallback(async () => {
    setLoadingMenu(true);
    try {
      const [categoriesData, itemsData] = await Promise.all([
        menuService.getCategories(id),
        menuService.getItems({ restaurant: id }),
      ]);
      
      setCategories(categoriesData.results || categoriesData);
      setMenuItems(itemsData.results || itemsData);
    } catch (error) {
      console.error(`Failed to load menu for restaurant ${id}:`, error.message || error);
    } finally {
      setLoadingMenu(false);
    }
  }, [id]);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
    loadMenu();
  }, [id, dispatch, loadMenu]);

  const handleAddToCart = (item) => {
    try {
      dispatch(addToCart({
        ...item,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
        },
      }));
      alert('✅ Added to cart!');
    } catch (error) {
      alert('❌ ' + error.message);
    }
  };

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  if (loading) return <LoadingSpinner fullScreen />;
  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Restaurant not found</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo */}
            <div className="w-32 h-32 bg-white rounded-lg shadow-lg flex items-center justify-center text-6xl flex-shrink-0">
              🍽️
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-gray-700 mb-4 text-lg">{restaurant.description}</p>
                </div>
                {restaurant.is_active ? (
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ✓ Open Now
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ✗ Closed
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-2xl">⭐</span>
                  <span className="ml-2 text-xl font-semibold">
                    {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-gray-600 ml-2">
                    ({restaurant.total_reviews || 0} reviews)
                  </span>
                </div>
                <span className="text-gray-700 text-xl font-semibold">
                  {restaurant.price_range || '$$'}
                </span>
              </div>

              {/* Cuisines */}
              {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisine_types.map((cuisine, index) => (
                    <span
                      key={index}
                      className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact */}
              <div className="space-y-1 text-gray-700">
                <p>📍 {restaurant.address}</p>
                <p>📞 {restaurant.phone}</p>
                {restaurant.email && <p>📧 {restaurant.email}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Menu</h2>

        {loadingMenu ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Category Tabs */}
            {categories.length > 0 && (
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-lg whitespace-nowrap font-medium transition ${
                    !selectedCategory
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Items ({menuItems.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg whitespace-nowrap font-medium transition ${
                      selectedCategory === category.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({menuItems.filter(item => item.category === category.id).length})
                  </button>
                ))}
              </div>
            )}

            {/* Menu Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🍽️</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description || 'Delicious food item'}
                      </p>

                      {/* Price and Add Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.is_available}
                          className={`px-6 py-2 rounded-lg font-semibold transition ${
                            item.is_available
                              ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {item.is_available ? '+ Add' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No items in this category</h3>
                <p className="text-gray-600">Try selecting a different category</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reservation Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <ReservationForm restaurantId={restaurant.id} restaurantName={restaurant.name} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
