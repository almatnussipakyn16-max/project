import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const Cart: FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, restaurantName } = useCart();

  // ✅ Фильтруем только валидные items
  const validItems = items.filter(item => item && item.menuItem && item.menuItem.id);

  const handleCheckout = () => {
    navigate('/orders/create');
  };

  if (validItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🛒</span>
          <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
          <p className="text-gray-500 mb-8">
            Добавьте блюда из меню ресторанов
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Перейти к ресторанам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Корзина ({totalItems})</h1>
          {restaurantName && (
            <p className="text-gray-600 mt-2">Ресторан: {restaurantName}</p>
          )}
        </div>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 transition"
        >
          Очистить корзину
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {validItems.map((item) => {
            // ✅ Дополнительная проверка внутри map
            if (!item || !item.menuItem) {
              return null;
            }

            return (
              <div
                key={item.menuItem.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex gap-4">
                  {/* Изображение */}
                  {item.menuItem.image && (
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name || 'Menu item'}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  {/* Информация */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      {item.menuItem.name || 'Без названия'}
                    </h3>
                    {item.menuItem.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.menuItem.description}
                      </p>
                    )}
                    <p className="text-orange-600 font-bold">
                      ${typeof item.menuItem.price === 'number' 
                        ? item.menuItem.price.toFixed(2) 
                        : parseFloat(String(item.menuItem.price || 0)).toFixed(2)}
                    </p>
                  </div>

                  {/* Количество и действия */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Количество */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Удалить */}
                    <button
                      onClick={() => removeItem(item.menuItem.id)}
                      className="text-red-600 hover:text-red-700 transition mt-2"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Итого */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Итого</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Товаров:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Сумма:</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
            >
              Оформить заказ
            </button>

            <Link
              to="/"
              className="block text-center mt-4 text-gray-600 hover:text-gray-800 transition"
            >
              ← Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;