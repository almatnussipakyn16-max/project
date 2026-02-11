import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { TEXTS } from '../../utils/constants';

export const Header: FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold text-primary-500">FoodDelivery</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary-500 transition-colors">
              {TEXTS.home}
            </Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-primary-500 transition-colors">
              {TEXTS.restaurants}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-primary-500 transition-colors">
                  {TEXTS.orders}
                </Link>
                <Link to="/reservations" className="text-gray-700 hover:text-primary-500 transition-colors">
                  {TEXTS.reservations}
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <svg className="h-6 w-6 text-gray-700 hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="text-gray-700 hover:text-primary-500 transition-colors">
                  {user?.first_name || TEXTS.profile}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  {TEXTS.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-500 transition-colors">
                  {TEXTS.login}
                </Link>
                <Link to="/register" className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                  {TEXTS.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
