import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { menuApi } from '../../api/menu';
import { Spinner } from '../../components/common/Spinner';
import MenuItemCard from '../../components/menu/MenuItemCard';

const RestaurantDetail: FC = () => {
  const { id } = useParams<{ id: string }>();

  // Получить ресторан
  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantsApi.getById(Number(id)),
    enabled: !!id,
  });

  // Получить меню ресторана
  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => menuApi.getByRestaurant(Number(id)),
    enabled: !!id,
  });

  if (restaurantLoading || menuLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!restaurant?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ресторан не найден</p>
        </div>
      </div>
    );
  }

  const restaurantData = restaurant.data;
  const menuItems = menuData?.data?.results || menuData?.data || [];

  // ✅ Безопасное преобразование rating
  const rating = typeof restaurantData.rating === 'number'
    ? restaurantData.rating
    : parseFloat(restaurantData.rating || '0');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка ресторана */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Изображение */}
            {restaurantData.image && (
              <img
                src={restaurantData.image}
                alt={restaurantData.name}
                className="w-full md:w-80 h-64 object-cover rounded-xl shadow-lg"
              />
            )}

            {/* Информация */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{restaurantData.name}</h1>

              {/* Рейтинг и кухня */}
              <div className="flex items-center gap-4 mb-4">
                {/* ✅ ИСПРАВЛЕНО - используем переменную rating */}
                <span className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">⭐</span>
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {restaurantData.cuisine_types?.join(', ')}
                </span>
              </div>

              {/* Описание */}
              <p className="text-gray-700 mb-6">{restaurantData.description}</p>

              {/* Информационные блоки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Адрес */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-gray-600">{restaurantData.address_line1}</p>
                    <p className="text-gray-600">{restaurantData.city}</p>
                  </div>
                </div>

                {/* Телефон */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-gray-600">{restaurantData.phone}</p>
                  </div>
                </div>

                {/* Доставка */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {restaurantData.delivery_available ? '🚚' : '🏪'}
                  </span>
                  <div>
                    <p className="font-semibold">
                      {restaurantData.delivery_available ? 'Доставка' : 'Самовывоз'}
                    </p>
                    <p className="text-gray-600">
                      {restaurantData.delivery_available
                        ? 'Доставка доступна'
                        : 'Только самовывоз'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                {restaurantData.email && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">{restaurantData.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Меню */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Меню</h2>

        {menuItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Меню пока не добавлено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;