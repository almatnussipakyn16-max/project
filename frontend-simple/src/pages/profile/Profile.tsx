import { FC, useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';

const Profile: FC = () => {
  const { user, setAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [message, setMessage] = useState('');

  const updateMutation = useMutation({
    mutationFn: (data: any) => authApi.updateProfile(data),
    onSuccess: (response) => {
      const accessToken = useAuthStore.getState().accessToken;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (accessToken && refreshToken) {
        setAuth(response.data, accessToken, refreshToken);
      }
      setMessage('Профиль успешно обновлён');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: () => {
      setMessage('Ошибка обновления профиля');
      setTimeout(() => setMessage(''), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ ФИКС: user должен быть из store, а не null
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Загрузка профиля...</p>
      </div>
    );
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      'ADMIN': 'Администратор',
      'RESTAURANT_OWNER': 'Владелец ресторана',
      'STAFF': 'Менеджер',
      'CUSTOMER': 'Клиент',
      'DEVELOPER': 'Разработч��к',
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('успешно') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Аватар и основная инфо */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-4xl">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                {getRoleName(user.role)}
              </span>
            </div>
          </div>

          {/* Форма редактирования */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  placeholder="+7 777 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Редактировать
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: user?.first_name || '',
                        last_name: user?.last_name || '',
                        phone: user?.phone || '',
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Отмена
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;