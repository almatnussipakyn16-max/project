import { FC } from 'react';
import type { MenuItem } from '../../api/types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatPrice } from '../../utils/formatters';
import { TEXTS } from '../../utils/constants';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <Card className="h-full flex flex-col">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-lg">{item.name}</h4>
          {item.is_featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Популярное
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 flex-1">
          {item.description}
        </p>

        {item.dietary_tags && item.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietary_tags.map((tag, index) => (
              <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-500">
            {formatPrice(item.price)}
          </span>
          <Button
            onClick={() => onAddToCart(item)}
            disabled={!item.is_available}
          >
            {item.is_available ? TEXTS.addToCart : 'Недоступно'}
          </Button>
        </div>

        {item.preparation_time && (
          <p className="text-xs text-gray-500 mt-2">
            ⏱️ {item.preparation_time} мин
          </p>
        )}
      </div>
    </Card>
  );
};
