import { FC } from 'react';
import { useCartStore } from '../../store/cart';
import type { MenuItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: number;
  restaurantName: string;
}

const MenuItemCard: FC<MenuItemCardProps> = ({ item, restaurantId, restaurantName }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // ✅ ФИКС: Передаём restaurantId и restaurantName
    addItem(item, restaurantId, restaurantName);
  };

  const price = typeof item.price === 'number' 
    ? item.price 
    : parseFloat(item.price || '0');

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Изображение */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Контент */}
      <div className="p-4">
        {/* Название и цена */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold flex-1">{item.name}</h3>
          <span className="text-xl font-bold text-orange-500 ml-2">
            {price.toFixed(2)} ₸
          </span>
        </div>

        {/* Описание */}
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Теги */}
        {item.dietary_tags && item.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.dietary_tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Время приготовления */}
        {item.preparation_time && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="mr-1">⏱️</span>
            <span>{item.preparation_time} мин</span>
          </div>
        )}

        {/* Кнопка добавить в корзину */}
        <button
          onClick={handleAddToCart}
          disabled={!item.is_available}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            item.is_available
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.is_available ? '🛒 Добавить в корзину' : 'Недоступно'}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;