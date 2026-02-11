import { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { TEXTS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

export const Profile: FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Необходимо войти в систему</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{TEXTS.profile}</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Имя
              </label>
              <p className="text-lg">{user.first_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Фамилия
              </label>
              <p className="text-lg">{user.last_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Телефон
              </label>
              <p className="text-lg">{user.phone || 'Не указан'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Роль
              </label>
              <p className="text-lg">{user.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Дата регистрации
              </label>
              <p className="text-lg">{formatDateTime(user.date_joined)}</p>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Быстрые ссылки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/orders"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📦</div>
              <p className="font-medium">{TEXTS.myOrders}</p>
            </a>
            <a
              href="/reservations"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📅</div>
              <p className="font-medium">{TEXTS.reservations}</p>
            </a>
            <a
              href="/support"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">💬</div>
              <p className="font-medium">{TEXTS.support}</p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};
