import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            🍽️ FoodDelivery
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition">
              Home
            </Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-orange-600 transition">
              Restaurants
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative text-gray-700 hover:text-orange-600 transition">
                  <span className="text-2xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative text-gray-700 hover:text-orange-600 transition">
                  <span className="text-2xl">🛒</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition">
                    <span className="text-2xl">👤</span>
                    <span>{user?.first_name || 'Account'}</span>
                    <span>▼</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 transition">
                      👤 Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 transition">
                      📦 My Orders
                    </Link>
                    <Link to="/reservations" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 transition">
                      📅 Reservations
                    </Link>
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-orange-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
