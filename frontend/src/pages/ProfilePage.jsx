import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { authService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiPackage, FiDollarSign, FiCalendar, FiStar } from 'react-icons/fi';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { list: orders } = useSelector((state) => state.orders);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    dispatch(fetchOrders());
  }, [dispatch, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await authService.updateProfile(formData);
      await dispatch(fetchCurrentUser());
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error occurred';
      toast.error(`Failed to update profile: ${errorMessage}`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    setIsEditing(false);
  };

  if (loading || !user) {
    return <LoadingSpinner fullScreen />;
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
  const recentOrders = orders.slice(0, 3);
  
  // Find favorite restaurant (most ordered from)
  const restaurantCounts = {};
  orders.forEach(order => {
    const restId = order.restaurant?.id;
    if (restId) {
      restaurantCounts[restId] = (restaurantCounts[restId] || 0) + 1;
    }
  });
  const favoriteRestaurantId = Object.keys(restaurantCounts).reduce((a, b) => 
    restaurantCounts[a] > restaurantCounts[b] ? a : b, null
  );
  const favoriteRestaurant = orders.find(o => o.restaurant?.id === parseInt(favoriteRestaurantId))?.restaurant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-8 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg mx-auto mb-4">
                  👤
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-orange-100 mt-1">{user.email}</p>
              </div>

              {/* User Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <FiMail className="text-orange-600 text-xl" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-semibold">{user.email}</div>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <FiPhone className="text-orange-600 text-xl" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-semibold">{user.phone}</div>
                    </div>
                  </div>
                )}
                
                {user.address && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <FiMapPin className="text-orange-600 text-xl" />
                    <div>
                      <div className="text-xs text-gray-500">Address</div>
                      <div className="font-semibold">{user.address}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-4xl mb-2">
                  <FiPackage className="text-orange-600 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-4xl mb-2">
                  <FiDollarSign className="text-green-600 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-4xl mb-2">
                  <FiCalendar className="text-blue-600 mx-auto" />
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-gray-600">Member Since</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-4xl mb-2">
                  <FiStar className="text-yellow-600 mx-auto" />
                </div>
                <div className="text-xs font-bold text-gray-900 truncate">
                  {favoriteRestaurant?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Favorite</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Edit Form or Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiUser className="text-orange-600" />
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    <FiEdit2 />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
                    >
                      <FiX />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                      <FiSave />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>
            </motion.div>

            {/* Recent Orders */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FiPackage className="text-orange-600" />
                    Recent Orders
                  </h2>
                  <Link
                    to="/orders"
                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                  >
                    View All →
                  </Link>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={`/orders/${order.id}`}
                          className="block p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 border-2 border-transparent hover:border-orange-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">🍽️</div>
                              <div>
                                <div className="font-bold text-gray-900">Order #{order.id}</div>
                                <div className="text-sm text-gray-600">{order.restaurant?.name}</div>
                              </div>
                            </div>
                            <StatusBadge status={order.status} size="sm" />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="font-bold text-orange-600">
                              ${parseFloat(order.total_price || 0).toFixed(2)}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-lg">No orders yet</p>
                    <Link
                      to="/restaurants"
                      className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Start Ordering →
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
