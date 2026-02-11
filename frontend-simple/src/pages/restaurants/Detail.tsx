import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { menuApi } from '../../api/menu';
import { useCart } from '../../hooks/useCart';
import { MenuCategory } from '../../components/menu/MenuCategory';
import { Spinner } from '../../components/common/Spinner';
import { Badge } from '../../components/common/Badge';
import type { MenuItem } from '../../api/types';
import { TEXTS } from '../../utils/constants';

export const RestaurantDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantsApi.getById(Number(id)),
    enabled: !!id,
  });

  const { data: menuData, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => menuApi.getItems({ restaurant: Number(id) }),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', id],
    queryFn: () => menuApi.getCategories(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = (item: MenuItem) => {
    if (restaurant) {
      addToCart(item, restaurant.id);
    }
  };

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Ресторан не найден</p>
      </div>
    );
  }

  // Группировка позиций меню по категориям
  const menuByCategory: Record<number, MenuItem[]> = {};
  menuData?.results.forEach((item) => {
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    menuByCategory[item.category].push(item);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-md">
        {restaurant.image && (
          <div className="h-64 overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
              <span className="text-gray-600">({restaurant.total_reviews} {TEXTS.reviews})</span>
            </div>
            
            {restaurant.cuisine_types.map((type) => (
              <Badge key={type}>{type}</Badge>
            ))}
          </div>

          <p className="text-gray-600 mb-4">{restaurant.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Адрес:</strong> {restaurant.address_line1}, {restaurant.city}
            </div>
            <div>
              <strong>Телефон:</strong> {restaurant.phone}
            </div>
            <div className="flex gap-3">
              {restaurant.delivery_available && (
                <Badge variant="success">Доставка</Badge>
              )}
              {restaurant.takeout_available && (
                <Badge variant="info">Самовывоз</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Меню</h2>
        
        {categoriesData?.results.map((category) => (
          <MenuCategory
            key={category.id}
            categoryName={category.name}
            items={menuByCategory[category.id] || []}
            onAddToCart={handleAddToCart}
          />
        ))}

        {(!categoriesData || categoriesData.results.length === 0) && (
          <p className="text-center text-gray-500 py-8">
            Меню пока недоступно
          </p>
        )}
      </div>
    </div>
  );
};
