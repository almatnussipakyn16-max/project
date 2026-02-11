# Food Delivery Platform - Простой фронтенд

Новый чистый фронтенд на **TypeScript + React** с интеграцией всех backend API.

## Особенности

- ✅ **TypeScript** - безопасность типов
- ✅ **TanStack Query** - умное кэширование API
- ✅ **Zustand** - простой state management
- ✅ **Tailwind CSS** - современный дизайн
- ✅ **Полностью на русском языке**
- ✅ **Работает без багов**

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр production сборки
npm run preview
```

## Структура

```
src/
├── api/                    # API клиенты
│   ├── client.ts           # Axios instance с interceptors
│   ├── types.ts            # TypeScript типы
│   ├── auth.ts             # Аутентификация API
│   ├── restaurants.ts      # Рестораны API
│   ├── menu.ts             # Меню API
│   ├── orders.ts           # Заказы API
│   ├── reservations.ts     # Бронирования API
│   ├── payments.ts         # Платежи API
│   ├── promotions.ts       # Промокоды API
│   ├── notifications.ts    # Уведомления API
│   └── support.ts          # Поддержка API
│
├── components/             # Переиспользуемые компоненты
│   ├── common/             # Общие UI компоненты
│   ├── layout/             # Layout компоненты
│   ├── restaurant/         # Компоненты ресторанов
│   ├── menu/               # Компоненты меню
│   ├── cart/               # Компоненты корзины
│   └── order/              # Компоненты заказов
│
├── pages/                  # Страницы приложения
│   ├── Home.tsx
│   ├── auth/               # Аутентификация
│   ├── restaurants/        # Рестораны
│   ├── cart/               # Корзина
│   ├── checkout/           # Оформление
│   ├── orders/             # Заказы
│   ├── reservations/       # Бронирования
│   ├── profile/            # Профиль
│   └── support/            # Поддержка
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useDebounce.ts
│
├── store/                  # Zustand stores
│   ├── auth.ts
│   └── cart.ts
│
├── utils/                  # Утилиты
│   ├── constants.ts
│   ├── formatters.ts
│   └── validators.ts
│
├── App.tsx                 # Главный компонент
├── main.tsx                # Entry point
└── index.css               # Tailwind styles
```

## API endpoints

Интеграция со всеми 12 модулями backend:

- ✅ Аутентификация (`/api/auth/`)
- ✅ Рестораны (`/api/restaurants/`)
- ✅ Меню (`/api/menu/`)
- ✅ Заказы (`/api/orders/`)
- ✅ Бронирования (`/api/reservations/`)
- ✅ Платежи (`/api/payments/`)
- ✅ Промокоды (`/api/promotions/`)
- ✅ Уведомления (`/api/notifications/`)
- ✅ Поддержка (`/api/support/`)
- ✅ Аналитика (`/api/analytics/`)
- ✅ Инвентарь (`/api/inventory/`)
- ✅ API для разработчиков (`/api/developers/`)

## Конфигурация

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Настройте переменные окружения:

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Stripe Public Key (опционально)
VITE_STRIPE_PUBLIC_KEY=

# Sentry DSN (опционально)
VITE_SENTRY_DSN=
```

## Основные возможности

### Аутентификация

- Регистрация новых пользователей
- Вход в систему с JWT токенами
- Автоматическое обновление токенов
- Защищённые маршруты

### Рестораны

- Просмотр списка ресторанов
- Поиск и фильтрация
- Детальная информация о ресторане
- Просмотр меню

### Заказы

- Добавление в корзину
- Оформление заказа
- Выбор способа доставки
- Отслеживание статуса заказа
- История заказов

### Бронирования

- Создание бронирования столика
- Просмотр активных броней
- Управление бронированиями

### Поддержка

- Создание тикетов поддержки
- Просмотр тикетов
- Отслеживание статуса

## Технологии

- **React 18** - UI библиотека
- **TypeScript 5** - типизация
- **Vite** - сборщик
- **TanStack Query** - управление серверным состоянием
- **Zustand** - управление клиентским состоянием
- **React Router** - роутинг
- **Axios** - HTTP клиент
- **Tailwind CSS** - стили

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Проверка типов
npm run build

# Линтинг (если настроен)
npm run lint
```

## Production

```bash
# Создание production сборки
npm run build

# Предпросмотр production сборки
npm run preview
```

Готовая сборка будет в папке `dist/`.

## Структура компонентов

Все компоненты следуют единому стилю:

- Функциональные компоненты с TypeScript
- Props интерфейсы для типизации
- Tailwind CSS для стилизации
- Адаптивный дизайн (mobile-first)

## State Management

- **Zustand** для auth и cart
- **TanStack Query** для API данных
- Local storage для персистентности

## Безопасность

- JWT токены с автоматическим обновлением
- Защищённые маршруты
- Валидация форм
- CORS настроен через Vite proxy

## Производительность

- Code splitting по маршрутам
- Кэширование API запросов
- Debounce для поиска
- Оптимизированные изображения

## Доступность

- Семантический HTML
- ARIA атрибуты
- Keyboard navigation
- Screen reader friendly

## Поддержка браузеров

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)

## Лицензия

MIT

## Контакты

Для вопросов и предложений: info@fooddelivery.kz
