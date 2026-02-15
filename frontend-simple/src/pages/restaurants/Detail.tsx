import { FC } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { menuApi } from '../../api/menu';
import { Spinner } from '../../components/common/Spinner';
import MenuItemCard from '../../components/menu/MenuItemCard';
import { formatRating } from '../../utils/formatters';

const RestaurantDetail: FC = () => {
  const { id } = useParams<{ id: string }>();

  // ✅ ФИКС: Проверяем ID сразу
  const restaurantId = Number(id);
  
  if (!id || isNaN(restaurantId)) {
    return <Navigate to="/" replace />;
  }

  const { data: restaurant, isLoading: restaurantLoading, error } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => restaurantsApi.getById(restaurantId),
  });

  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuApi.getByRestaurant(restaurantId),
  });

  console.log('Restaurant ID:', restaurantId);
  console.log('Restaurant data:', restaurant);
  console.log('Menu data:', menuData);

  if (restaurantLoading || menuLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    console.error('Error loading restaurant:', error);
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ресторан не найден</p>
          <Link to="/" className="text-orange-500 hover:underline mt-2 inline-block">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  // Парсим меню
  const menuItems = menuData?.results || menuData?.data?.results || menuData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка ресторана */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Изображение */}
            {restaurant.cover_image ? (
              <img
                src={restaurant.cover_image}
                alt={restaurant.name}
                className="w-full md:w-80 h-64 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-full md:w-80 h-64 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-8xl">🍽️</span>
              </div>
            )}

            {/* Информация */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>

              {/* Рейтинг и кухня */}
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">⭐</span>
                  <span className="font-semibold">{formatRating(restaurant.rating)}</span>
                </span>
                {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {restaurant.cuisine_types.join(', ')}
                    </span>
                  </>
                )}
              </div>

              {/* Описание */}
              {restaurant.description && (
                <p className="text-gray-700 mb-6">{restaurant.description}</p>
              )}

              {/* Информационные блоки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Адрес */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-gray-600">{restaurant.address_line1}</p>
                    {restaurant.address_line2 && (
                      <p className="text-gray-600">{restaurant.address_line2}</p>
                    )}
                    <p className="text-gray-600">{restaurant.city}</p>
                  </div>
                </div>

                {/* Телефон */}
                {restaurant.phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold">Телефон</p>
                      <a href={`tel:${restaurant.phone}`} className="text-gray-600 hover:text-orange-500">
                        {restaurant.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Доставка */}
                {restaurant.delivery_available && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="font-semibold">Доставка</p>
                      <p className="text-gray-600">Доставка доступна</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {restaurant.email && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href={`mailto:${restaurant.email}`} className="text-gray-600 hover:text-orange-500">
                        {restaurant.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Теги */}
              <div className="flex flex-wrap gap-2 mt-6">
                {restaurant.delivery_available && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    🚚 Доставка
                  </span>
                )}
                {restaurant.reservation_available && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    📅 Бронирование
                  </span>
                )}
                {restaurant.takeout_available && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    🏪 Самовывоз
                  </span>
                )}
              </div>

              {/* Действия */}
              <div className="flex gap-4 mt-6">
                <Link
                  to="/reservations/create"
                  state={{ restaurantId: restaurant.id, restaurantName: restaurant.name }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  📅 Забронировать столик
                </Link>
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
            <span className="text-6xl mb-4 block">📋</span>
            <p className="text-gray-500 text-lg">Меню пока не добавлено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item: any) => (
              <MenuItemCard 
                key={item.id} 
                item={item}
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;