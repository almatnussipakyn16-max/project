import { FC } from 'react';
import { Link } from 'react-router-dom';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-lg font-bold mb-4">Рестораны.КЗ</h3>
            <p className="text-gray-400 text-sm">
              Платформа бронирования столиков и заказа еды в лучших ресторанах Казахстана.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-gray-400 hover:text-white transition text-sm">
                  Бронирования
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-gray-400 hover:text-white transition text-sm">
                  Акции
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition text-sm">
                  Заказы
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-lg font-bold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition text-sm">
                  Частые вопросы
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition text-sm">
                  Техподдержка
                </Link>
              </li>
              <li>
                <a href="mailto:support@restaurants.kz" className="text-gray-400 hover:text-white transition text-sm">
                  support@restaurants.kz
                </a>
              </li>
              <li>
                <a href="tel:+77001234567" className="text-gray-400 hover:text-white transition text-sm">
                  +7 (700) 123-45-67
                </a>
              </li>
            </ul>
          </div>

          {/* Соцсети */}
          <div>
            <h3 className="text-lg font-bold mb-4">Мы в соцсетях</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                🐦
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Рестораны.КЗ. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;