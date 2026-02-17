import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useCartStore } from '../../store/cart';

const Header: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold text-orange-500">Рестораны.КЗ</span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition">
              Главная
            </Link>
            <Link to="/reservations" className="text-gray-700 hover:text-orange-500 transition">
              Бронирования
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-gray-700 hover:text-orange-500 transition">
                Заказы
              </Link>
            )}
            <Link to="/promotions" className="text-gray-700 hover:text-orange-500 transition">
              Акции
            </Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-4">
            {/* Корзина */}
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Авторизация */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Favorites */}
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-orange-500 transition"
                  title="Favorites"
                >
                  ❤️
                </Link>

                {/* Owner Panel Link */}
                {user?.role === 'RESTAURANT_OWNER' && (
                  <Link
                    to="/owner"
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm"
                  >
                    🏪 Owner Panel
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-orange-500 transition"
                >
                  👤 {user?.first_name || user?.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-orange-500 transition"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;