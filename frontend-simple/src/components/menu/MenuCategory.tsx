import { FC } from 'react';
import type { MenuItem as MenuItemType } from '../../api/types';
import { MenuItemCard } from './MenuItem';

interface MenuCategoryProps {
  categoryName: string;
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType) => void;
}

export const MenuCategory: FC<MenuCategoryProps> = ({ categoryName, items, onAddToCart }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">{categoryName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};
