import { FC } from 'react';
import { Link } from 'react-router-dom';
import { TEXTS } from '../../utils/constants';

export const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-lg font-semibold mb-4">О платформе</h3>
            <p className="text-gray-400 text-sm">
              Платформа доставки еды из лучших ресторанов Казахстана
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  {TEXTS.home}
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                  {TEXTS.restaurants}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  {TEXTS.orders}
                </Link>
              </li>
            </ul>
          </div>

          {/* Помощь */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Помощь</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                  {TEXTS.support}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Частые вопросы
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@fooddelivery.kz</li>
              <li>Телефон: +7 (777) 123-45-67</li>
              <li>Адрес: Алматы, Казахстан</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 FoodDelivery. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;