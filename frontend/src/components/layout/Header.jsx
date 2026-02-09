import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            🍽️ Restaurant Platform
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200">Home</Link>
            <Link to="/restaurants" className="hover:text-primary-200">Restaurants</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hover:text-primary-200">My Orders</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="hover:text-primary-200">Admin</Link>
                )}
                {user?.role === 'RESTAURANT_OWNER' && (
                  <Link to="/restaurant-dashboard" className="hover:text-primary-200">Dashboard</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-primary-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
